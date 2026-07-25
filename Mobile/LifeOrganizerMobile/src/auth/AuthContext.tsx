import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "./tokenStorage";
import { apiClient } from "@/api/apiClient";
import { User } from "@/types/user";
import { clearUserProfile, getCachedUserProfile, saveUserProfile } from "@/database/repositories/userRepository";

type AuthContextType = {
    token: string | null;
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadToken();
    }, []);

    async function loadToken() {
        const savedToken = await getToken();
        if (!savedToken) {
            setLoading(false);
            return;
        }

        setToken(savedToken);
        try {
            const response = await apiClient.get("/auth/me");
            setUser(response.data);
            await saveUserProfile(response.data);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                await removeToken();
                await clearUserProfile();
                setToken(null);
                setUser(null);
            } else {
                const cachedUser = await getCachedUserProfile();
                setUser(cachedUser);
            }
        } finally {
            setLoading(false);
        }
    }

    async function login(token: string) {
        await saveToken(token);
        setToken(token);
        try {
            const response = await apiClient.get("/auth/me");
            setUser(response.data);
            await saveUserProfile(response.data);
        } catch {
            //const cachedUser = await getCachedUserProfile();
            //setUser(cachedUser);
        }
    }

    async function logout() {
        await removeToken();
        await clearUserProfile();
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout, }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}