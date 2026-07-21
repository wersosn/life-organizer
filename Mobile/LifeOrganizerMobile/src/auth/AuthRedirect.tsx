import { Redirect } from "expo-router";
import { useAuth } from "./AuthContext";

export default function AuthRedirect({ children }: { children: React.ReactNode; }) 
{
    const { token } = useAuth();
    if (!token) {
        return <Redirect href="../login" />;
    }
    return children;
}