import { Redirect } from "expo-router";
import { useAuth } from "./authProvider";


export default function AuthRedirect({ children }: { children: React.ReactNode; }) 
{
    const { token, loading } = useAuth();
    if (loading) {
        return null;
    }

    if (!token) {
        return <Redirect href="../login" />;
    }
    return children;
}