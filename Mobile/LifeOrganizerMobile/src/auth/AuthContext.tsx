import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from "./tokenStorage";
import { apiClient } from "@/api/apiClient";
import { User } from "@/types/user";
import { API_URL } from "@/config/api";
import axios from "axios";
import { AUTH_EVENTS, authEvents } from "./AuthEvents";
import { clearUserProfileLocally, saveUserProfileLocally } from "@/database/repositories/userRepository";

type AuthContextType = {
    token: string | null;
    user: User | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchAndSetUser() {
        const response = await apiClient.get("/auth/me");
        setUser(response.data);
        saveUserProfileLocally({ id: response.data.id, email: response.data.email, name: response.data.name });
    }

    async function resetSession() {
        setToken(null);
        setUser(null);
        await removeTokens();
        clearUserProfileLocally();
    }

    useEffect(() => {
        loadSession();

        const unsubRefreshed = authEvents.on(AUTH_EVENTS.TOKEN_REFRESHED, (newAccessToken: string) => {
            setToken(newAccessToken);
        });
        const unsubExpired = authEvents.on(AUTH_EVENTS.SESSION_EXPIRED, () => {
            setToken(null);
            setUser(null);
        });

        return () => {
            unsubRefreshed();
            unsubExpired();
        };
    }, []);

    async function loadSession() {
        const savedToken = await getAccessToken();
        const savedRefreshToken = await getRefreshToken();

        if (!savedToken && !savedRefreshToken) {
            setLoading(false);
            return;
        }

        if (savedToken) {
            setToken(savedToken);
        }

        try {
            await fetchAndSetUser();
        } catch (error: any) {
            if (error?.response?.status === 401) {
                await resetSession();
            }
        } finally {
            setLoading(false);
        }
    }

    async function login(accessToken: string, refreshToken: string) {
        await saveTokens(accessToken, refreshToken);
        setToken(accessToken);
        try {
            await fetchAndSetUser();
        } catch (error: any) {
            if (error?.response?.status === 401) {
                await resetSession();
            }
        }
    }

    async function logout() {
        try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                await axios.post(`${API_URL}/auth/logout`, { refreshToken });
            }
        } catch {

        } finally {
            await resetSession();
        }
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );


    /*useEffect(() => {
        loadToken();
    }, []);

    async function loadToken() {
        const savedToken = await getAccessToken();
        if (!savedToken) {
            setLoading(false);
            return;
        }

        setToken(savedToken);
        
        try {
            const response = await apiClient.get("/auth/me");
            setUser(response.data);
            //await saveUserProfile(response.data);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                await removeTokens();
                //await clearUserProfile();
                setToken(null);
                setUser(null);
            } else {
                //const cachedUser = await getCachedUserProfile();
                //setUser(cachedUser);
            }
        } finally {
            setLoading(false);
        }
    }

    async function login(accessToken: string, refreshToken: string) {
        await saveTokens(accessToken, refreshToken);
        setToken(accessToken);
        try {
            const response = await apiClient.get("/auth/me");
            setUser(response.data);
            //await saveUserProfile(response.data);
        } catch {
            //const cachedUser = await getCachedUserProfile();
            //setUser(cachedUser);
        }
    }

    async function logout() {
        await removeTokens();
        //await clearUserProfile();
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout, }}>
            {children}
        </AuthContext.Provider>
    );*/
}

export function useAuth() {
    return useContext(AuthContext);
}