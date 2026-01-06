import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/cdaxxlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineShoppingCart, HiHeart } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { useAuth } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "./CartContext";

/* EXPLORE DATA */
const exploreData = {
  "Learn AI": [
    "AI Fundamentals",
    "AI For Professionals",
    "AI For Developers",
    "AI For Creatives",
  ],
  "Launch a new career": [
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "Cloud Engineer",
  ],
  "Prepare for certification": [
    "AWS Certification",
    "Google Cloud",
    "Azure Fundamentals",
  ],
  "Practice with Role Play": [
    "Interview Practice",
    "Client Simulation",
    "Mock Projects",
  ],
  Development: ["Web Development", "Mobile Development", "Game Development"],
  Business: ["Entrepreneurship", "Management", "Finance"],
  "IT & Software": ["Networking", "Cyber Security", "DevOps"],
  Design: ["UI Design", "UX Research", "Graphic Design"],
  Marketing: ["Digital Marketing", "SEO", "Content Marketing"],
};

// Logout Confirmation Modal Component
const LogoutConfirmation = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div className="p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Are you sure?
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              You will be logged out of your account. You'll need to sign in
              again to access your courses and profile.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default function Navbar() {
  //  Props remove karo, sab AuthContext se lega
  const { isAuthenticated, user, logout, openLogin, openSignup } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(3);
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { cart } = useCart();

  //  User check remove karo - AuthContext handle karega
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "";
    const firstInitial = user.firstName
      ? user.firstName.charAt(0).toUpperCase()
      : "";
    const lastInitial = user.lastName
      ? user.lastName.charAt(0).toUpperCase()
      : "";
    return firstInitial + lastInitial;
  };

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  // Actual logout function
  const handleLogout = () => {
    logout(); //  AuthContext ka logout use karo
    setShowLogoutConfirm(false);
    setMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[60px]">
        <div className="h-full bg-[#eaf9ff]/95 backdrop-blur border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
            {/* LOGO */}
            <Link to="/">
              <img src={logo} alt="CDAXX" className="h-14 md:h-16" />
            </Link>

            {/* CENTER */}
            <div className="hidden lg:flex flex-1 items-center gap-8 mx-4">
              <Link to="/">
                <button className="font-medium px-2 py-1 hover:text-blue-600 transition-colors">
                  Home
                </button>
              </Link>

              {/* EXPLORE MEGA MENU */}
              <div
                className="relative"
                onMouseEnter={() => setShowExplore(true)}
                onMouseLeave={() => {
                  setShowExplore(false);
                  setActiveCategory(null);
                }}
              >
                <button className="font-medium px-2 py-1 hover:text-blue-600 transition-colors">
                  Explore
                </button>

                {/* MEGA MENU */}
                <div
                  className={`absolute left-0 top-full mt-3 bg-white shadow-2xl rounded-xl border z-50
                    transition-all duration-200 ${
                      showExplore
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                >
                  <div className="flex">
                    {/* LEFT – MAIN CATEGORIES */}
                    <ul className="w-[320px] border-r">
                      {Object.keys(exploreData).map((category) => (
                        <li
                          key={category}
                          onMouseEnter={() => setActiveCategory(category)}
                          className={`flex items-center justify-between px-5 py-3 cursor-pointer text-sm font-medium
                            ${
                              activeCategory === category
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-blue-50"
                            }`}
                        >
                          <span>{category}</span>
                          <HiChevronRight className="text-gray-400" />
                        </li>
                      ))}
                    </ul>

                    {/* RIGHT – SUB CATEGORIES */}
                    {activeCategory && (
                      <div className="w-[320px] p-5">
                        <ul className="space-y-3">
                          {exploreData[activeCategory].map((sub) => (
                            <li
                              key={sub}
                              className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                            >
                              <span>{sub}</span>
                              <HiChevronRight className="text-gray-300" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEARCH */}
              <form className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors">
                  Search
                </button>
              </form>

              <Link
                to="/plans-pricing"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Plans & Pricing
              </Link>

              <Link
                to="/privacy-policy"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Privacy & Policy
              </Link>

              {/* FAVOURITES */}
              <Link to="/favourites" className="relative group">
                <div className="flex items-center gap-1 font-medium hover:text-blue-500 transition-colors">
                  <HiHeart className="text-lg" />
                  <span>Favourites</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* RIGHT - USER MENU */}
            <div className="hidden lg:flex items-center gap-4">
              {/* CART */}
              <Link to="/cart" className="relative group">
                <motion.button className="flex items-center gap-1 px-4 py-2 rounded-full border text-sm hover:bg-blue-50 transition-colors">
                  <HiOutlineShoppingCart size={18} />
                  Cart
                  {/* Cart count badge */}
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </motion.button>
              </Link>

              {isAuthenticated && user ? (
                // USER IS LOGGED IN - Show avatar with dropdown
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg transition-all duration-300 group"
                    title={`${user.firstName} ${user.lastName}`}
                  >
                    {getUserInitials()}
                  </button>

                  {/* USER DROPDOWN MENU */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </Link>

                      <Link
                        to="/my-courses"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        My Courses
                      </Link>

                      <Link
                        to="/favourites"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HiHeart className="w-4 h-4 text-blue-500" />
                        My Favourites
                        {favoritesCount > 0 && (
                          <span className="ml-auto bg-red-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {favoritesCount}
                          </span>
                        )}
                      </Link>

                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // USER IS NOT LOGGED IN
                <>
                  <button
                    onClick={openLogin}
                    className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>

                  <button
                    onClick={openSignup}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="lg:hidden px-4 pb-6 space-y-4 border-t bg-[#eaf9ff]">
              {isAuthenticated && user ? (
                // MOBILE: USER LOGGED IN
                <>
                  <div className="py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </Link>

                  <Link
                    to="/my-courses"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    My Courses
                  </Link>

                  <Link
                    to="/favourites"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiHeart className="w-5 h-5 text-blue-500" />
                    Favourites
                    {favoritesCount > 0 && (
                      <span className="ml-auto bg-red-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/explore-courses"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Explore
                  </Link>

                  <Link
                    to="/plans-pricing"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Plans & Pricing
                  </Link>

                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Privacy & Policy
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiOutlineShoppingCart size={18} />
                    Cart
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      2
                    </span>
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:from-red-700 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                // MOBILE: USER NOT LOGGED IN
                <>
                  <Link
                    to="/explore-courses"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Explore
                  </Link>

                  <Link
                    to="/plans-pricing"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Plans & Pricing
                  </Link>

                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    Privacy & Policy
                  </Link>

                  <Link
                    to="/favourites"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiHeart className="w-5 h-5 text-blue-500" />
                    Favourites
                    {favoritesCount > 0 && (
                      <span className="ml-auto bg-red-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 py-3 border-b"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiOutlineShoppingCart size={18} />
                    Cart
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      2
                    </span>
                  </Link>

                  {/* LOGIN/SIGNUP BUTTONS */}
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => {
                        openLogin();
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        openSignup();
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Popup */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
