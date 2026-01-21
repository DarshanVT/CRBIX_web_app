import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useAuth } from "./AuthContext";

// ✅ API IMPORT
import { loginUser, registerUser } from "../../Api/auth.api";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const { loginSuccess } = useAuth();
  const [isPanelActive, setIsPanelActive] = useState(mode === "signup");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    cPass: "",
  });

  // Dark mode state from AuthContext
  const { darkMode } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsPanelActive(mode === "signup");
      setErrorMsg("");
    }
  }, [mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrorMsg("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.cPass) {
      setErrorMsg("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    console.log("🔄 Attempting registration...");
    const res = await registerUser(formData);
    console.log("📥 Registration response:", res);
    
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Registration failed");
      return;
    }

    // ✅ SUCCESS - Auto-login after registration
    if (res.user) {
      console.log("✅ Registration successful, auto-login");
      loginSuccess(res.user);
      onClose();
    } else {
      // If no user data, just switch to login
      alert("Registration successful! Please login.");
      setIsPanelActive(false);
      
      // Clear password fields only
      setFormData(prev => ({
        ...prev,
        password: "",
        cPass: ""
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter email and password");
      setLoading(false);
      return;
    }

    console.log("🔄 Attempting login...");
    const res = await loginUser({
      email: formData.email,
      password: formData.password,
    });

    console.log("📥 Login response:", res);
    
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Login failed");
      return;
    }

    // Check localStorage to see what was stored
    console.log("🔍 After login, localStorage:", {
      auth_token: localStorage.getItem('auth_token')?.substring(0, 20) + '...',
      user_id: localStorage.getItem('user_id'),
      user_info: localStorage.getItem('user_info')
    });

    // ✅ SUCCESS - Handle different response formats
    if (res.user) {
      console.log("✅ Login successful with user object");
      loginSuccess(res.user);
      onClose();
    } else if (res.userId) {
      console.log("✅ Login successful with userId");
      loginSuccess({ id: res.userId, email: formData.email });
      onClose();
    } else {
      // Try to get user from localStorage
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        console.log("✅ Login successful, user found in localStorage");
        loginSuccess(JSON.parse(userInfo));
        onClose();
      } else {
        setErrorMsg("Login successful but no user data received");
      }
    }
  };

  // Blue color scheme
  const darkBlue = "#1a237e";
  const fancyBlue = "#2196f3";
  const blueGradient = `linear-gradient(135deg, ${darkBlue} 0%, ${fancyBlue} 100%)`;

  // Dark mode styles
  const wrapperStyles = {
    backgroundColor: darkMode ? "#1f2937" : "#fff",
    borderRadius: "20px",
    boxShadow: darkMode 
      ? "0 20px 60px rgba(0, 0, 0, 0.5)" 
      : "0 20px 60px rgba(0, 0, 0, 0.3)",
    position: "relative",
    overflow: "hidden",
    width: "850px",
    maxWidth: "100%",
    minHeight: "550px",
    transition: "background-color 0.3s, box-shadow 0.3s",
  };

  const formBoxStyles = {
    position: "absolute",
    top: 0,
    height: "100%",
    transition: "all 0.6s ease-in-out",
  };

  const loginBox = {
    ...formBoxStyles,
    left: 0,
    width: "50%",
    zIndex: 2,
    transform: isPanelActive ? "translateX(100%)" : "translateX(0)",
  };

  const registerBox = {
    ...formBoxStyles,
    left: 0,
    width: "50%",
    opacity: isPanelActive ? 1 : 0,
    zIndex: isPanelActive ? 5 : 1,
    transform: isPanelActive ? "translateX(100%)" : "translateX(0)",
  };

  const slideWrapper = {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "50%",
    height: "100%",
    overflow: "hidden",
    transition: "transform 0.6s ease-in-out",
    transform: isPanelActive ? "translateX(-100%)" : "translateX(0)",
    zIndex: 100,
  };

  const slide = {
    background: blueGradient,
    color: "#fff",
    position: "relative",
    left: "-100%",
    height: "100%",
    width: "200%",
    transform: isPanelActive ? "translateX(50%)" : "translateX(0)",
    transition: "transform 0.6s ease-in-out",
  };

  const panel = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 50px",
    textAlign: "center",
    top: 0,
    height: "100%",
    width: "50%",
    transition: "transform 0.6s ease-in-out",
  };

  const panelLeft = {
    ...panel,
    transform: isPanelActive ? "translateX(0)" : "translateX(-20%)",
  };

  const panelRight = {
    ...panel,
    right: 0,
    transform: isPanelActive ? "translateX(20%)" : "translateX(0)",
  };

  const form = {
    backgroundColor: darkMode ? "#1f2937" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 50px",
    height: "100%",
    textAlign: "center",
    transition: "background-color 0.3s",
  };

  const input = {
    backgroundColor: darkMode ? "#374151" : "#f3f4f6",
    border: errorMsg ? "2px solid #ef4444" : "2px solid transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    margin: "8px 0",
    width: "100%",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
    color: darkMode ? "#f3f4f6" : "#1f2937",
  };

  const button = {
    borderRadius: "25px",
    border: "none",
    background: loading ? "#94a3b8" : blueGradient,
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    padding: "14px 50px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading ? "none" : `0 4px 15px rgba(33, 150, 243, 0.4)`,
    marginTop: "15px",
    fontFamily: "'Poppins', sans-serif",
    width: "100%",
  };

  const ghostBtn = {
    ...button,
    background: "transparent",
    border: "2px solid #FFFFFF",
    boxShadow: "none",
    width: "auto",
    padding: "12px 40px",
  };

  const social = {
    border: darkMode ? `2px solid #60a5fa` : `2px solid ${fancyBlue}`,
    borderRadius: "50%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    height: "45px",
    width: "45px",
    transition: "all 0.3s ease",
    color: darkMode ? "#60a5fa" : fancyBlue,
    fontSize: "18px",
    textDecoration: "none",
    margin: "0 5px",
    cursor: "pointer",
    backgroundColor: "transparent",
  };

  const headingStyle = {
    fontWeight: "700",
    margin: "0 0 0px 0",
    fontSize: "28px",
    color: darkMode ? "#f3f4f6" : "#333",
    fontFamily: "'Poppins', sans-serif",
    transition: "color 0.3s",
  };

  const paragraphStyle = {
    fontSize: "15px",
    fontWeight: "300",
    lineHeight: "24px",
    letterSpacing: "0.5px",
    margin: "15px 0 25px",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    maxWidth: "350px",
  };

  const panelHeadingStyle = {
    fontWeight: "700",
    margin: "0",
    fontSize: "28px",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] backdrop-blur-sm transition-colors duration-200"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.25,
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-[850px]">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute -top-10 -right-1 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700 z-[10000] transition-all duration-300"
                style={{
                  boxShadow: darkMode 
                    ? "0 8px 25px rgba(0, 0, 0, 0.3)" 
                    : "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
              >
                <HiX size={20} className="text-gray-700 dark:text-gray-300" />
              </button>

              {/* ERROR MESSAGE */}
              {errorMsg && (
                <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-3 rounded-lg shadow-lg transition-colors duration-200 ${
                  darkMode 
                    ? "bg-red-900/30 border border-red-800 text-red-300" 
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  <p className="text-center font-medium">{errorMsg}</p>
                </div>
              )}

              {/* AUTH FORM */}
              <div style={wrapperStyles}>
                {/* REGISTER FORM */}
                <div style={registerBox}>
                  <form style={form} onSubmit={handleRegisterSubmit}>
                    <h1 style={headingStyle}>Create Account</h1>

                    <div style={{ margin: "5px 0 5px 0", display: "flex", justifyContent: "center", gap: "12px" }}>
                      <button type="button" style={social}>
                        <FaFacebookF />
                      </button>
                      <button type="button" style={social}>
                        <FaGoogle />
                      </button>
                      <button type="button" style={social}>
                        <FaLinkedinIn />
                      </button>
                    </div>

                    <div style={{ width: "100%", maxWidth: "320px" }}>
                      <input
                        name="firstName"
                        style={input}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="lastName"
                        style={input}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        style={input}
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="phoneNo"
                        type="tel"
                        style={input}
                        placeholder="Phone Number"
                        value={formData.phoneNo}
                        onChange={handleInputChange}
                      />
                      <input
                        name="password"
                        type="password"
                        style={input}
                        placeholder="Password (min. 6 characters)"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                      />
                      <input
                        name="cPass"
                        type="password"
                        style={input}
                        placeholder="Confirm Password"
                        value={formData.cPass}
                        onChange={handleInputChange}
                        required
                      />

                      <button 
                        style={button} 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "SIGN UP"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* LOGIN FORM */}
                <div style={loginBox}>
                  <form style={form} onSubmit={handleLoginSubmit}>
                    <h1 style={headingStyle}>Sign In</h1>

                    <div style={{ margin: "15px 0 20px 0", display: "flex", justifyContent: "center", gap: "12px" }}>
                      <button type="button" style={social}>
                        <FaFacebookF />
                      </button>
                      <button type="button" style={social}>
                        <FaGoogle />
                      </button>
                      <button type="button" style={social}>
                        <FaLinkedinIn />
                      </button>
                    </div>

                    <div style={{ width: "100%", maxWidth: "320px" }}>
                      <input
                        name="email"
                        type="email"
                        style={input}
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="password"
                        type="password"
                        style={input}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />

                      <div style={{ textAlign: "right", margin: "10px 0 15px 0" }}>
                        <a
                          href="#"
                          style={{
                            color: darkMode ? "#60a5fa" : fancyBlue,
                            fontSize: "14px",
                            textDecoration: "none",
                            fontFamily: "'Poppins', sans-serif",
                            transition: "color 0.3s",
                          }}
                        >
                          Forgot your password?
                        </a>
                      </div>

                      <button 
                        style={button} 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "SIGN IN"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* SLIDE PANEL */}
                <div style={slideWrapper}>
                  <div style={slide}>
                    <div style={panelLeft}>
                      <h1 style={panelHeadingStyle}>Welcome Back!</h1>
                      <p style={paragraphStyle}>
                        Stay connected by logging in with your credentials and continue your experience
                      </p>
                      <button 
                        style={ghostBtn} 
                        onClick={() => {
                          setIsPanelActive(false);
                          setErrorMsg("");
                        }}
                        disabled={loading}
                      >
                        SIGN IN
                      </button>
                    </div>

                    <div style={panelRight}>
                      <h1 style={panelHeadingStyle}>Hey There!</h1>
                      <p style={paragraphStyle}>
                        Begin your amazing journey by creating an account with us today
                      </p>
                      <button 
                        style={ghostBtn} 
                        onClick={() => {
                          setIsPanelActive(true);
                          setErrorMsg("");
                        }}
                        disabled={loading}
                      >
                        SIGN UP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}