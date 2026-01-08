// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./components/Footer/Footer";
import HomeSections from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import { CartProvider } from "./components/Navbar/CartContext";
import { AuthProvider, useAuth } from "./components/Login/AuthContext";
import Cart from "./pages/Cart";
import PrivacyPolicy from "./pages/privacyPolicy";
import CourseDetails from "./pages/CourseDetails";

import { checkServerStatus } from "./Api/auth.api";
import Payment from "./pages/Payment";
import { FavoritesProvider } from "./components/Navbar/FavoritesContext";

import { ProfileProvider } from "./components/Profile/ProfileContext";
import ProfilePage from "./pages/ProfilePage";
import Investors from "./components/Footer/Investors";
import Blogs from "./components/Footer/Blogs";
import ContactUs from "./components/Footer/ContactUs";
import Careers from "./components/Footer/Careers";
import AboutUs from "./components/Footer/aboutUs";
import HelpSupport from "./components/Footer/HelpSupport";
import TechOnCDaX from "./components/Footer/TechOnCDaX";
import Accessibility from "./components/Footer/Accessibility";
import TermsAndConditions from "./components/Footer/TermsAndConditions";
import CourseGridSection from "./components/Courses/CourseSection";
import CoursePlans from "./components/Courses/CoursePlans";
import FavouritesPage from "./pages/FavouritesPage"
import AuthModal from "./components/Login/AuthModal";

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
              <Route path="/courses" element={<CourseGridSection />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/plans-pricing" element={<CoursePlans />} />
              <Route path="/favourites" element={<FavouritesPage />} /> 
              <Route path="/payment" element={<Payment />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/tech-on-cdax" element={<TechOnCDaX />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/investors" element={<Investors />} />
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
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;