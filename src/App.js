import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import HomeSections from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import { CartProvider } from "./components/Navbar/CartContext";
import { AuthProvider, useAuth } from "./components/Login/AuthContext";
import Cart from "./pages/Cart";
import PrivacyPolicy from "./components/Footer/privacyPolicy";
import CourseDetails from "./pages/CourseDetails";
import Payment from "./pages/Payment";
import { FavoritesProvider, useFavorites } from "./components/Navbar/FavoritesContext"; // Import useFavorites here
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
import MyCourses from "./pages/MyCourses";
import SettingsPage from "./components/Profile/SettingsPage";
import CertificationsPage from "./components/Profile/CertificationsPage";
import PlacementPage from "./components/Profile/PlacementPage";
import { ThemeProvider } from "./components/Profile/ThemeContext"; 
import ReminderPopup from "./pages/ReminderPopup";

// Create a separate component that uses useFavorites
function AppWithReminders() {
  const { showReminder, reminderCourse, handleDismissReminder, handleReminderPurchaseClick } = useFavorites();

  return (
    <>
      {/* Your existing AppContent without the useFavorites hook */}
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          {/* NAVBAR */}
          <Navbar />

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
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/placement" element={<PlacementPage />} />
            </Routes>
          </main>

          {/* FOOTER */}
          <Footer />
          
          {/* REMINDER POPUP */}
          <ReminderPopup
            isOpen={showReminder}
            course={reminderCourse}
            onDismiss={(courseId) => handleDismissReminder(courseId, false)}
            onDismissPermanently={(courseId) => handleDismissReminder(courseId, true)}
            onPurchase={handleReminderPurchaseClick}
          />
        </div>
      </Router>
    </>
  );
}

// Create a wrapper component for AuthModal
function AuthModalWrapper() {
  const { authOpen, authMode, closeAuth } = useAuth();
  return <AuthModal isOpen={authOpen} onClose={closeAuth} mode={authMode} />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProfileProvider>
          <CartProvider>
            <FavoritesProvider>
              {/* Use the AppWithReminders component inside FavoritesProvider */}
              <AppWithReminders />
              {/* AuthModalWrapper needs to be inside AuthProvider but outside other contexts */}
              <AuthModalWrapper />
            </FavoritesProvider>
          </CartProvider>
        </ProfileProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;