import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userInfo =
      localStorage.getItem("user_info") || localStorage.getItem("user");

    console.log("🔍 AuthContext init check:", {
      token: !!token,
      userInfo: !!userInfo,
      user_id: localStorage.getItem("user_id"),
    });

    if (token && userInfo) {
      setIsAuth(true);
      setToken(token);
      setUser(JSON.parse(userInfo));
      console.log("✅ AuthContext: User authenticated");
    } else {
      console.log("⚠️ AuthContext: No valid auth data found");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => {
      console.log("📱 Opening login modal from 401");
      openLogin();
    };

    window.addEventListener("open-login-modal", handleOpenLogin);

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLogin);
    };
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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const loginSuccess = (userData) => {
    console.log("🎯 loginSuccess called with:", userData);
    
    // Get tokens from localStorage (set by API)
    const authToken = localStorage.getItem("auth_token");
    const userId = localStorage.getItem("user_id");
    const userInfo = localStorage.getItem("user_info");
    
    console.log("🔍 Storage check in loginSuccess:", {
      authToken: authToken ? `${authToken.substring(0, 20)}...` : 'none',
      userId: userId,
      userInfo: userInfo ? JSON.parse(userInfo) : 'none'
    });
    
    // If we have userData parameter but no localStorage data yet
    if (userData && !authToken) {
      console.log("📦 Using userData parameter to set auth state");
      
      // Create user info object
      const userInfoObj = {
        id: userData.id || userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        ...userData
      };
      
      // Set localStorage if not already set
      if (!localStorage.getItem("user_info")) {
        localStorage.setItem("user_info", JSON.stringify(userInfoObj));
      }
      
      if (!localStorage.getItem("user_id") && userInfoObj.id) {
        localStorage.setItem("user_id", userInfoObj.id);
      }
      
      // Check again for token
      const updatedToken = localStorage.getItem("auth_token");
      
      if (updatedToken) {
        setIsAuth(true);
        setToken(updatedToken);
        setUser(userInfoObj);
        closeAuth();
        console.log("✅ AuthContext: Login successful with userData parameter");
        return true;
      }
    }
    
    // Normal flow - check localStorage
    if (authToken && userInfo) {
      setIsAuth(true);
      setToken(authToken);
      setUser(JSON.parse(userInfo));
      closeAuth();
      console.log("✅ AuthContext: Login successful from localStorage");
      return true;
    } else {
      console.error("❌ AuthContext: Missing auth data", {
        hasToken: !!authToken,
        hasUserInfo: !!userInfo
      });
      
      // Try to use userData as fallback
      if (userData) {
        console.log("🔄 Using userData as fallback");
        const userInfoObj = {
          id: userData.id || userData._id || userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          ...userData
        };
        
        // Set state anyway
        setIsAuth(true);
        setUser(userInfoObj);
        setToken(authToken || 'placeholder-token');
        closeAuth();
        console.log("⚠️ AuthContext: Login with fallback data");
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    const userId = user?.id || user?._id;

    console.log("🚪 Logging out user:", userId);

    const authItemsToRemove = [
      "auth_token",
      "refresh_token",
      "user_id",
      "user_info",
      "user",
    ];

    authItemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
      console.log("🗑️ Removed auth item:", item);
    });

    Object.keys(localStorage).forEach((key) => {
      if (
        key === "auth_token" ||
        key === "refresh_token" ||
        key === "user_id" ||
        key === "user_info" ||
        key === "user"
      ) {
        localStorage.removeItem(key);
      }
    });

    setIsAuth(false);
    setToken(null);
    setUser(null);
    console.log(
      "✅ AuthContext: User logged out (Avatar preserved in local storage)",
    );
    console.log(
      "🖼️ Avatar still in storage:",
      localStorage.getItem(`user_avatar_${userId}`) ? "YES" : "NO",
    );
  };

  const clearAllUserData = () => {
    const userId = user?.id || user?._id;
    if (userId) {
      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes(userId.toString()) ||
          key.includes("auth") ||
          key.includes("token") ||
          key.includes("user")
        ) {
          localStorage.removeItem(key);
          console.log("🗑️ Removed:", key);
        }
      });
      console.log("✅ All user data cleared (including avatar)");
    }
  };

  // Update localStorage when user changes
  useEffect(() => {
    if (user && token) {
      console.log("💾 Updating localStorage with current user");
      localStorage.setItem("user_info", JSON.stringify(user));
      localStorage.setItem("user_id", user.id || user._id);
    }
  }, [user, token]);

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
        token,
        loginSuccess,
        logout,
        setUser,
        clearAllUserData,

        darkMode,
        setDarkMode,
        toggleDarkMode,
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