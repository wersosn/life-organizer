import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, saveToken } from "./tokenStorage";

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    loading: true,
    login: async (token: string) => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkToken() {
            const storedToken = await getToken();
            setToken(storedToken);
            setLoading(false);
        }
        checkToken();
    }, []);

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