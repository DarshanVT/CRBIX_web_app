import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiCheckCircle } from "react-icons/hi";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { loginUser, registerUser } from "../../Api/auth.api";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const { loginSuccess, darkMode } = useAuth();
  const [isPanelActive, setIsPanelActive] = useState(mode === "signup");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Validation state for each field
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    cPass: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    cPass: "",
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsPanelActive(mode === "signup");
      setErrorMsg("");
      setSuccessMsg("");
      setFieldErrors({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        password: "",
        cPass: "",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        password: "",
        cPass: "",
      });
    }
  }, [mode, isOpen]);

  // Field validation functions
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (!/^[A-Za-z\s'-]+$/.test(value)) {
          error = "Only letters, spaces, hyphens (-) and apostrophes (') are allowed";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "First name cannot exceed 50 characters";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (!/^[A-Za-z\s'-]+$/.test(value)) {
          error = "Only letters, spaces, hyphens (-) and apostrophes (') are allowed";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Last name cannot exceed 50 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 100) {
          error = "Email cannot exceed 100 characters";
        }
        break;

      case "phoneNo":
        // Phone is optional, but if provided, validate it
        if (value.trim() && value !== "") {
          // Remove any non-digit characters for validation
          const cleanPhone = value.replace(/\D/g, '');
          if (!/^\d+$/.test(cleanPhone)) {
            error = "Phone number must contain only digits";
          } else if (cleanPhone.length !== 10) {
            error = "Phone number must be exactly 10 digits";
          }
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (value.length > 50) {
          error = "Password cannot exceed 50 characters";
        }
        break;

      case "cPass":
        if (isPanelActive) {
          if (!value.trim()) {
            error = "Please confirm your password";
          } else if (formData.password !== value) {
            error = "Passwords do not match";
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input change with real-time validation for some fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clean input based on field type
    let cleanedValue = value;
    
    switch (name) {
      case "firstName":
      case "lastName":
        // Remove numbers and symbols (keeping only letters, spaces, hyphens, apostrophes)
        cleanedValue = value.replace(/[^A-Za-z\s'-]/g, '');
        break;
        
      case "phoneNo":
        // Remove non-digit characters
        cleanedValue = value.replace(/\D/g, '');
        // Limit to 10 digits
        if (cleanedValue.length > 10) {
          cleanedValue = cleanedValue.substring(0, 10);
        }
        break;
        
      case "email":
        // Remove spaces from email
        cleanedValue = value.replace(/\s/g, '');
        break;
        
      default:
        cleanedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Clear general error and success messages
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
    
    // Real-time validation for confirm password when password changes
    if (name === "password" && formData.cPass) {
      const cPassError = validateField("cPass", formData.cPass);
      setFieldErrors((prev) => ({ ...prev, cPass: cPassError }));
    }
  };

  // Validate specific field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate all fields before submission
  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    // Only validate required fields for the current mode
    const fieldsToValidate = isPanelActive 
      ? ["firstName", "lastName", "email", "password", "cPass"] 
      : ["email", "password"];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Validate phone if provided (optional field)
    if (formData.phoneNo && formData.phoneNo.trim() !== "") {
      const phoneError = validateField("phoneNo", formData.phoneNo);
      if (phoneError) {
        errors.phoneNo = phoneError;
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Auto hide success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields first
    if (!validateAllFields()) {
      setErrorMsg("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    console.log("🚀 Attempting registration...", formData);
    const res = await registerUser(formData);
    console.log("✅ Registration response:", res);

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Registration failed");
      return;
    }

    console.log("📊 Registration Response Data:", {
      hasUser: !!res.user,
      user: res.user,
      hasUserId: !!res.userId,
      userId: res.userId,
      hasToken: !!res.token,
      hasData: !!res.data,
      message: res.message
    });

    // Check if API automatically logged in the user (has token in localStorage)
    const tokenInStorage = localStorage.getItem("auth_token");
    console.log("🔍 Token in localStorage after register:", tokenInStorage);
    
    // ALWAYS show success message first
    setSuccessMsg("Account created successfully! Please login.");
    
    // ALWAYS clear password fields
    setFormData((prev) => ({
      ...prev,
      password: "",
      cPass: "",
    }));
    
    // Clear password field errors
    setFieldErrors((prev) => ({
      ...prev,
      password: "",
      cPass: "",
    }));
    
    // Switch to login panel after 2 seconds
    setTimeout(() => {
      console.log("🔄 Switching to login panel");
      setIsPanelActive(false); // Switch to login
    }, 2000);
    
    // DON'T call loginSuccess - let user login manually
  };

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validate login fields
    const loginErrors = {};
    if (!formData.email.trim()) loginErrors.email = "Email is required";
    if (!formData.password.trim()) loginErrors.password = "Password is required";
    
    if (Object.keys(loginErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...loginErrors }));
      setErrorMsg("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    console.log("🚀 Attempting login...", {
      email: formData.email,
      password: formData.password
    });
    
    const loginPayload = {
      email: formData.email,
      password: formData.password,
    };

    const res = await loginUser(loginPayload);
    console.log("✅ Login response:", res);

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Login failed");
      return;
    }

    console.log("📊 Login Response Data:", {
      hasUser: !!res.user,
      user: res.user,
      hasUserId: !!res.userId,
      userId: res.userId,
      hasToken: !!res.token,
      token: res.token ? `${res.token.substring(0, 20)}...` : 'no token',
      hasData: !!res.data,
      fullResponse: res
    });

    console.log("🔍 Checking localStorage AFTER login API call:");
    console.log("auth_token:", localStorage.getItem("auth_token"));
    console.log("user_id:", localStorage.getItem("user_id"));
    console.log("user_info:", localStorage.getItem("user_info"));

    let userDataToPass = null;

    if (res.user) {
      userDataToPass = res.user;
    } else if (res.userId) {
      userDataToPass = { 
        id: res.userId, 
        email: formData.email 
      };
    } else if (res.data) {
      userDataToPass = res.data;
    }

    // If still no user data, check localStorage
    if (!userDataToPass) {
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        try {
          userDataToPass = JSON.parse(userInfo);
          console.log("📦 Found user data in localStorage:", userDataToPass);
        } catch (err) {
          console.error("❌ Error parsing localStorage user_info:", err);
        }
      }
    }

    // If we have user data, proceed with loginSuccess
    if (userDataToPass) {
      console.log("🎉 Login successful!");
      
      // Show success message first
      setSuccessMsg("Login successful! Welcome back!");
      
      // Then login and close modal after 2 seconds
      setTimeout(() => {
        console.log("🔄 Calling loginSuccess...");
        const loginResult = loginSuccess(userDataToPass);
        console.log("✅ loginSuccess result:", loginResult);
        
        // Close modal
        onClose();
      }, 2000);
    } else {
      console.error("❌ No user data found in response or localStorage");
      setErrorMsg("Login successful but no user data received. Please refresh the page.");
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const switchAuthMode = () => {
    setIsPanelActive(!isPanelActive);
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      password: "",
      cPass: "",
    });
    setFormData((prev) => ({
      ...prev,
      password: "",
      cPass: "",
    }));
  };

  const darkBlue = "#1a237e";
  const fancyBlue = "#2196f3";
  const blueGradient = `linear-gradient(135deg, ${darkBlue} 0%, ${fancyBlue} 100%)`;

  // Helper function to get input style with error state
  const getInputStyle = (fieldName) => {
    const hasError = fieldErrors[fieldName];
    return {
      backgroundColor: darkMode ? "#374151" : "#f3f4f6",
      border: hasError ? "2px solid #ef4444" : "2px solid transparent",
      borderRadius: "12px",
      padding: isMobile ? "14px 16px" : "10px 14px",
      margin: "8px 0",
      width: "100%",
      fontSize: isMobile ? "16px" : "14px",
      transition: "all 0.3s ease",
      fontFamily: "'Poppins', sans-serif",
      color: darkMode ? "#f3f4f6" : "#1f2937",
    };
  };

  const wrapperStyles = {
    backgroundColor: darkMode ? "#1f2937" : "#fff",
    borderRadius: isMobile ? "12px" : "20px",
    boxShadow: darkMode
      ? "0 20px 60px rgba(0, 0, 0, 0.5)"
      : "0 20px 60px rgba(0, 0, 0, 0.3)",
    position: "relative",
    overflow: "hidden",
    width: isMobile ? "100%" : "850px",
    maxWidth: "100%",
    minHeight: isMobile ? "auto" : "550px",
    maxHeight: isMobile ? "90vh" : "none",
    overflowY: isMobile ? "auto" : "visible",
    transition: "all 0.3s ease",
  };

  const desktopFormBoxStyles = {
    position: "absolute",
    top: 0,
    height: "100%",
    transition: "all 0.6s ease-in-out",
  };

  const desktopLoginBox = {
    ...desktopFormBoxStyles,
    left: 0,
    width: "50%",
    zIndex: 2,
    transform: isPanelActive ? "translateX(100%)" : "translateX(0)",
  };

  const desktopRegisterBox = {
    ...desktopFormBoxStyles,
    left: 0,
    width: "50%",
    opacity: isPanelActive ? 1 : 0,
    zIndex: isPanelActive ? 5 : 1,
    transform: isPanelActive ? "translateX(100%)" : "translateX(0)",
  };

  const mobileFormStyles = {
    padding: isMobile ? "40px 20px" : "0 50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isMobile ? "500px" : "100%",
    transition: "all 0.3s ease",
    width: "100%",
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
    display: isMobile ? "none" : "block",
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
    padding: "0 40px",
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
    padding: isMobile ? "20px" : "0 50px",
    height: isMobile ? "auto" : "100%",
    textAlign: "center",
    transition: "background-color 0.3s",
    width: "100%",
  };

  const button = {
    borderRadius: "25px",
    border: "none",
    background: loading ? "#94a3b8" : blueGradient,
    color: "#FFFFFF",
    fontSize: isMobile ? "15px" : "13px",
    fontWeight: "600",
    padding: isMobile ? "16px 50px" : "14px 50px",
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
    borderRadius: "25px",
    background: "transparent",
    border: "2px solid #FFFFFF",
    color: "#FFFFFF",
    fontSize: isMobile ? "15px" : "13px",
    fontWeight: "600",
    padding: isMobile ? "14px 40px" : "12px 40px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "15px",
    fontFamily: "'Poppins', sans-serif",
    width: isMobile ? "100%" : "auto",
  };

  const social = {
    border: darkMode ? `2px solid #60a5fa` : `2px solid ${fancyBlue}`,
    borderRadius: "50%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    height: isMobile ? "50px" : "45px",
    width: isMobile ? "50px" : "45px",
    transition: "all 0.3s ease",
    color: darkMode ? "#60a5fa" : fancyBlue,
    fontSize: isMobile ? "20px" : "18px",
    textDecoration: "none",
    margin: "0 5px",
    cursor: "pointer",
    backgroundColor: "transparent",
  };

  const headingStyle = {
    fontWeight: "700",
    margin: "0 0 10px 0",
    fontSize: isMobile ? "26px" : "28px",
    color: darkMode ? "#f3f4f6" : "#333",
    fontFamily: "'Poppins', sans-serif",
    transition: "color 0.3s",
  };

  const paragraphStyle = {
    fontSize: isMobile ? "15px" : "14px",
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
    fontSize: isMobile ? "26px" : "28px",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  };

  const mobileSwitchBtn = {
    background: "transparent",
    border: "none",
    color: fancyBlue,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "15px",
    fontFamily: "'Poppins', sans-serif",
    textDecoration: "underline",
    padding: "5px 10px",
  };

  const errorTextStyle = {
    color: "#ef4444",
    fontSize: "12px",
    textAlign: "left",
    marginTop: "-4px",
    marginBottom: "8px",
    fontFamily: "'Poppins', sans-serif",
    paddingLeft: "4px",
    minHeight: "16px",
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-[850px] mx-auto">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute -top-10 -right-1 md:-right-4 lg:-right-1 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700 z-[10000] transition-all duration-300"
                style={{
                  boxShadow: darkMode
                    ? "0 8px 25px rgba(0, 0, 0, 0.3)"
                    : "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
              >
                <HiX size={20} className="text-gray-700 dark:text-gray-300" />
              </button>

              {/* ERROR MESSAGE POPUP */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-3 rounded-lg shadow-lg transition-colors duration-200 ${
                    darkMode
                      ? "bg-red-900/30 border border-red-800 text-red-300"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <HiX className="text-red-500 flex-shrink-0" />
                    <p className="text-center font-medium">{errorMsg}</p>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS MESSAGE POPUP */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-3 rounded-lg shadow-lg transition-colors duration-200 ${
                    darkMode
                      ? "bg-green-900/30 border border-green-800 text-green-300"
                      : "bg-green-50 border border-green-200 text-green-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <HiCheckCircle className="text-green-500 flex-shrink-0" />
                    <p className="text-center font-medium">{successMsg}</p>
                  </div>
                </motion.div>
              )}

              {/* AUTH FORM */}
              <div style={wrapperStyles}>
                {isMobile ? (
                  /* MOBILE VIEW */
                  <div style={mobileFormStyles}>
                    <form
                      style={form}
                      onSubmit={
                        isPanelActive ? handleRegisterSubmit : handleLoginSubmit
                      }
                    >
                      <h1 style={headingStyle}>
                        {isPanelActive ? "Create Account" : "Sign In"}
                      </h1>

                      {/* Social Login */}
                      <div
                        style={{
                          margin: isPanelActive
                            ? "5px 0 15px 0"
                            : "15px 0 20px 0",
                          display: "flex",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
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
                        {isPanelActive ? (
                          /* REGISTER FORM - MOBILE */
                          <>
                            <input
                              name="firstName"
                              style={getInputStyle("firstName")}
                              placeholder="First Name *"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.firstName && (
                              <div style={errorTextStyle}>
                                {fieldErrors.firstName}
                              </div>
                            )}

                            <input
                              name="lastName"
                              style={getInputStyle("lastName")}
                              placeholder="Last Name *"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.lastName && (
                              <div style={errorTextStyle}>
                                {fieldErrors.lastName}
                              </div>
                            )}

                            <input
                              name="email"
                              type="email"
                              style={getInputStyle("email")}
                              placeholder="Email Address *"
                              value={formData.email}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.email && (
                              <div style={errorTextStyle}>
                                {fieldErrors.email}
                              </div>
                            )}

                            <input
                              name="phoneNo"
                              type="tel"
                              style={getInputStyle("phoneNo")}
                              placeholder="Phone Number (10 digits, optional)"
                              value={formData.phoneNo}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              maxLength="10"
                            />
                            {fieldErrors.phoneNo && (
                              <div style={errorTextStyle}>
                                {fieldErrors.phoneNo}
                              </div>
                            )}

                            <input
                              name="password"
                              type="password"
                              style={getInputStyle("password")}
                              placeholder="Password (min. 6 characters) *"
                              value={formData.password}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                              minLength={6}
                            />
                            {fieldErrors.password && (
                              <div style={errorTextStyle}>
                                {fieldErrors.password}
                              </div>
                            )}

                            <input
                              name="cPass"
                              type="password"
                              style={getInputStyle("cPass")}
                              placeholder="Confirm Password *"
                              value={formData.cPass}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.cPass && (
                              <div style={errorTextStyle}>
                                {fieldErrors.cPass}
                              </div>
                            )}
                          </>
                        ) : (
                          /* LOGIN FORM - MOBILE */
                          <>
                            <input
                              name="email"
                              type="email"
                              style={getInputStyle("email")}
                              placeholder="Email Address *"
                              value={formData.email}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.email && (
                              <div style={errorTextStyle}>
                                {fieldErrors.email}
                              </div>
                            )}

                            <input
                              name="password"
                              type="password"
                              style={getInputStyle("password")}
                              placeholder="Password *"
                              value={formData.password}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                            {fieldErrors.password && (
                              <div style={errorTextStyle}>
                                {fieldErrors.password}
                              </div>
                            )}

                            <div
                              style={{
                                textAlign: "right",
                                margin: "10px 0 15px 0",
                              }}
                            >
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
                          </>
                        )}

                        <button style={button} type="submit" disabled={loading}>
                          {loading
                            ? isPanelActive
                              ? "Creating Account..."
                              : "Signing In..."
                            : isPanelActive
                              ? "SIGN UP"
                              : "SIGN IN"}
                        </button>

                        {/* Direct switch button - MOBILE */}
                        <button
                          type="button"
                          style={mobileSwitchBtn}
                          onClick={switchAuthMode}
                          disabled={loading}
                        >
                          {isPanelActive
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* DESKTOP VIEW */
                  <>
                    {/* REGISTER FORM */}
                    <div style={desktopRegisterBox}>
                      <form style={form} onSubmit={handleRegisterSubmit}>
                        <h1 style={headingStyle}>Create Account</h1>

                        <div
                          style={{
                            margin: "5px 0 5px 0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                          }}
                        >
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
                            style={getInputStyle("firstName")}
                            placeholder="First Name *"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.firstName && (
                            <div style={errorTextStyle}>
                              {fieldErrors.firstName}
                            </div>
                          )}

                          <input
                            name="lastName"
                            style={getInputStyle("lastName")}
                            placeholder="Last Name *"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.lastName && (
                            <div style={errorTextStyle}>
                              {fieldErrors.lastName}
                            </div>
                          )}

                          <input
                            name="email"
                            type="email"
                            style={getInputStyle("email")}
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.email && (
                            <div style={errorTextStyle}>
                              {fieldErrors.email}
                            </div>
                          )}

                          <input
                            name="phoneNo"
                            type="tel"
                            style={getInputStyle("phoneNo")}
                            placeholder="Phone Number (10 digits, optional)"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            maxLength="10"
                          />
                          {fieldErrors.phoneNo && (
                            <div style={errorTextStyle}>
                              {fieldErrors.phoneNo}
                            </div>
                          )}

                          <input
                            name="password"
                            type="password"
                            style={getInputStyle("password")}
                            placeholder="Password (min. 6 characters) *"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            minLength={6}
                          />
                          {fieldErrors.password && (
                            <div style={errorTextStyle}>
                              {fieldErrors.password}
                            </div>
                          )}

                          <input
                            name="cPass"
                            type="password"
                            style={getInputStyle("cPass")}
                            placeholder="Confirm Password *"
                            value={formData.cPass}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.cPass && (
                            <div style={errorTextStyle}>
                              {fieldErrors.cPass}
                            </div>
                          )}

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
                    <div style={desktopLoginBox}>
                      <form style={form} onSubmit={handleLoginSubmit}>
                        <h1 style={headingStyle}>Sign In</h1>

                        <div
                          style={{
                            margin: "15px 0 20px 0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                          }}
                        >
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
                            style={getInputStyle("email")}
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.email && (
                            <div style={errorTextStyle}>
                              {fieldErrors.email}
                            </div>
                          )}

                          <input
                            name="password"
                            type="password"
                            style={getInputStyle("password")}
                            placeholder="Password *"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                          {fieldErrors.password && (
                            <div style={errorTextStyle}>
                              {fieldErrors.password}
                            </div>
                          )}

                          <div
                            style={{
                              textAlign: "right",
                              margin: "10px 0 15px 0",
                            }}
                          >
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
                            Stay connected by logging in with your credentials
                            and continue your experience
                          </p>
                          <button
                            style={ghostBtn}
                            onClick={() => {
                              setIsPanelActive(false);
                              setErrorMsg("");
                              setFieldErrors({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phoneNo: "",
                                password: "",
                                cPass: "",
                              });
                            }}
                            disabled={loading}
                          >
                            SIGN IN
                          </button>
                        </div>

                        <div style={panelRight}>
                          <h1 style={panelHeadingStyle}>Hey There!</h1>
                          <p style={paragraphStyle}>
                            Begin your amazing journey by creating an account
                            with us today
                          </p>
                          <button
                            style={ghostBtn}
                            onClick={() => {
                              setIsPanelActive(true);
                              setErrorMsg("");
                              setFieldErrors({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phoneNo: "",
                                password: "",
                                cPass: "",
                              });
                            }}
                            disabled={loading}
                          >
                            SIGN UP
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}