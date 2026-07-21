import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "./tokenStorage";
import { apiClient } from "@/api/apiClient";

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
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

        try {
            await apiClient.get("/auth/me");
            setToken(savedToken);
        } catch {
            await removeToken();
            setToken(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(token: string) {
        await saveToken(token);
        setToken(token);
    }

    async function logout() {
        await removeToken();
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, loading, login, logout, }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}