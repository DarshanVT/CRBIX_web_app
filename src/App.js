// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import HomeSections from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import Cart from "./pages/Cart";
import PrivacyPolicy from "./pages/privacyPolicy";
import CourseDetails from "./pages/CourseDetails";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./components/AuthContext";
import { checkServerStatus } from "./Api/auth.api";
import Payment from "./pages/Payment";
import { FavoritesProvider } from "./components/FavoritesContext";
import FavouritesPage from "./pages/FavouritesPage";
import CoursePlans from "./components/CoursePlans";

function AppContent() {
  const { authOpen, authMode, openLogin, openSignup, closeAuth } = useAuth();

  useEffect(() => {
    // Check server connection on app load
    checkServerStatus().then((isRunning) => {
      if (!isRunning) {
        console.error("Backend server is not running!");
        // Optional: show alert only in development
        if (process.env.NODE_ENV === "development") {
          alert(
            "⚠️ Backend server is not running. Please start the Spring Boot application on port 8080."
          );
        }
      } else {
        console.log(" Backend server is running");
      }
    });
  }, []);

  return (
    <CartProvider>
        <FavoritesProvider>
      <Router>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col">
          {/* NAVBAR */}
          <Navbar openLogin={openLogin} openSignup={openSignup} />

          {/* PAGE CONTENT */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomeSections />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/plans-pricing" element={<CoursePlans />} />
              <Route path="/favourites" element={<FavouritesPage />} /> 
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>

          {/* FOOTER */}
          <Footer />

          {/* AUTH MODAL */}
          <AuthModal isOpen={authOpen} onClose={closeAuth} mode={authMode} />
        </div>
      </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
