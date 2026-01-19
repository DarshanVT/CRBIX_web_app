// src/components/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  // Sync with localStorage - CHECK ALL AUTH DATA
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userInfo = localStorage.getItem("user_info") || localStorage.getItem("user");
    
    console.log("🔄 AuthContext init check:", {
      token: !!token,
      userInfo: !!userInfo,
      user_id: localStorage.getItem("user_id")
    });
    
    if (token && userInfo) {
      setIsAuth(true);
      setUser(JSON.parse(userInfo));
      console.log("✅ AuthContext: User authenticated");
    } else {
      console.log("⚠️ AuthContext: No valid auth data found");
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

  // Call this after login success
  const loginSuccess = (userData) => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    const userId = localStorage.getItem('user_id');
      console.log("🔍 loginSuccess check:", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20),
      hasUserInfo: !!userInfo,
      userId: userId,
      userDataFromParam: userData
    });
      
    if (token && userInfo) {
      setIsAuth(true);
      setUser(JSON.parse(userInfo));
      closeAuth();
      console.log("✅ AuthContext: Login successful");
    } else {
          console.error("❌ AuthContext: Missing token or user info after login");
          console.error("   Token exists:", !!token);
          console.error("   User info exists:", !!userInfo);
          console.error("   User data from param:", userData);
    }
  };

const logout = () => {
  // Clear ALL auth data
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_info');
  localStorage.removeItem('user');
  
  // Also clear any other potential auth items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('token') || key.includes('auth') || key.includes('user')) {
      console.log("🗑️ Removing:", key);
    }
  });
  
  setIsAuth(false);
  setUser(null);
  console.log("✅ AuthContext: User logged out");
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
        user,
        loginSuccess,
        logout,
        setUser,
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