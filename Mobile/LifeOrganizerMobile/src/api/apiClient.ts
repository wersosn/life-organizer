import { AUTH_EVENTS, authEvents } from "@/auth/AuthEvents";
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from "@/auth/tokenStorage";
import { API_URL } from "@/config/api";
import * as Crypto from "expo-crypto";
import axios from "axios";
import axiosRetry from "axios-retry";

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

apiClient.interceptors.request.use(
    async config => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.method === "post" && !config.headers["Idempotency-Key"]) {
            config.headers["Idempotency-Key"] = Crypto.randomUUID();
        }
        return config;
    }
);

let isRefreshing = false;
let refreshQueue: { resolve: (v: any) => void; reject: (e: any) => void; config: any }[] = [];

function flushQueue(error: any, accessToken: string | null) {
    refreshQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
            return;
        }
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        resolve(apiClient(config));
    });
    refreshQueue = [];
}

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        const isAuthEndpoint = originalRequest?.url?.includes("/auth/refresh");
        if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            await saveTokens(accessToken, newRefreshToken);
            authEvents.emit(AUTH_EVENTS.TOKEN_REFRESHED, accessToken);

            flushQueue(null, accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            await removeTokens();
            flushQueue(refreshError, null);
            authEvents.emit(AUTH_EVENTS.SESSION_EXPIRED);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

axiosRetry(apiClient, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: error => {       
        return axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500;
    },
});