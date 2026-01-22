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

    console.log(" AuthContext init check:", {
      token: !!token,
      userInfo: !!userInfo,
      user_id: localStorage.getItem("user_id"),
    });

    if (token && userInfo) {
      setIsAuth(true);
      setToken(token);
      setUser(JSON.parse(userInfo));
      console.log(" AuthContext: User authenticated");
    } else {
      console.log(" AuthContext: No valid auth data found");
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
      console.log(" Opening login modal from 401");
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
    const token = localStorage.getItem("auth_token");
    const userInfo = localStorage.getItem("user_info");
    const userId = localStorage.getItem("user_id");

    console.log(" loginSuccess check:", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20),
      hasUserInfo: !!userInfo,
      userId: userId,
      userDataFromParam: userData,
    });

    if (token && userInfo) {
      setIsAuth(true);
      setToken(token);
      setUser(JSON.parse(userInfo));
      closeAuth();
      console.log(" AuthContext: Login successful");
    } else {
      console.error(" AuthContext: Missing token or user info after login");
    }
  };

  const logout = () => {
    const userId = user?.id || user?._id;

    console.log(" Logging out user:", userId);

    const authItemsToRemove = [
      "auth_token",
      "refresh_token",
      "user_id",
      "user_info",
      "user",
    ];

    authItemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
      console.log(" Removed auth item:", item);
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
      "AuthContext: User logged out (Avatar preserved in local storage)",
    );
    console.log(
      "Avatar still in storage:",
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
          console.log(" Removed:", key);
        }
      });
      console.log(" All user data cleared (including avatar)");
    }
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