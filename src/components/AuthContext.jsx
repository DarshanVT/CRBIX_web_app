// src/components/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null); //  Yahan setUser define karo

  //  sync with localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setIsAuth(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  //  call this after login success
  const loginSuccess = (userData) => {
    localStorage.setItem("token", "user-authenticated");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuth(true);
    setUser(userData); //  setUser use karo
    closeAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuth(false);
    setUser(null); //  setUser use karo
  };

  return (
    <AuthContext.Provider
      value={{
        authOpen,
        authMode,
        openLogin,
        openSignup,
        closeAuth,
        isAuthenticated: isAuth,
        user, //  user data provide karo
        loginSuccess,
        logout,
        setUser, //  setUser provide karo (agar needed ho)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};