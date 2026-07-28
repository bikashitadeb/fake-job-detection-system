import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token) {
      setUser({
        token,
        role,
      });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);

    setUser({
      token,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}