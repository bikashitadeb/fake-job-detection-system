
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // =====================================
    // CLEAR SESSION
    // =====================================
    const clearSession = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_time");

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // =====================================
    // INITIALIZE AUTH SESSION
    // =====================================
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem("access_token");
            const savedUser = localStorage.getItem("user");

            if (!savedToken || !savedUser) {
                clearSession();
                return;
            }

            const parsedUser = JSON.parse(savedUser);

            if (
                !parsedUser ||
                !parsedUser.role ||
                !parsedUser.id
            ) {
                clearSession();
                return;
            }

            const normalizedUser = {
                ...parsedUser,
                role: String(parsedUser.role).trim().toLowerCase()
            };

            setToken(savedToken);
            setUser(normalizedUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("AUTH INITIALIZATION ERROR:", error);
            clearSession();
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================
    // LOGIN
    // =====================================
    const login = (authData) => {
        try {
            const accessToken =
                authData?.access_token || authData?.token;

            const userData = authData?.user;

            if (!accessToken) {
                throw new Error("Access token missing");
            }

            if (!userData || !userData.role) {
                throw new Error("User information or role missing");
            }

            const normalizedUser = {
                ...userData,
                role: String(userData.role).trim().toLowerCase()
            };

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem(
                "user",
                JSON.stringify(normalizedUser)
            );
            localStorage.setItem(
                "login_time",
                new Date().toISOString()
            );

            setToken(accessToken);
            setUser(normalizedUser);
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            console.error("LOGIN CONTEXT ERROR:", error);
            clearSession();
            return false;
        }
    };

    // =====================================
    // LOGOUT
    // =====================================
    const logout = () => {
        clearSession();
    };

    // =====================================
    // ROLE CHECK
    // =====================================
    const hasRole = (role) => {
        return (
            String(user?.role || "").trim().toLowerCase() ===
            String(role || "").trim().toLowerCase()
        );
    };

    // =====================================
    // USER INFORMATION
    // =====================================
    const getUserName = () => {
        return user?.name || "User";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                login,
                logout,
                clearSession,
                hasRole,
                getUserName
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
