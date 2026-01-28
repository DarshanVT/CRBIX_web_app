import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/cdaxxlogo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiChevronRight,
  HiChevronDown,
  HiOutlineShoppingCart,
  HiHeart,
} from "react-icons/hi";
import { FiSearch, FiX, FiStar } from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import {
  searchCourses,
  getSearchSuggestions,
  getPopularTags,
  getCourses,
} from "../../Api/course.api";
import { useAuth } from "../Login/AuthContext";
import { useProfile } from "../Profile/ProfileContext";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "./CartContext";
import ExploreMenu, { MobileExploreMenu, exploreCategories } from "./explore";

/* -------------------- Logout Confirmation Component -------------------- */
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div className="p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
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
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Are you sure?
            </h3>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              You will be logged out of your account. You'll need to sign in
              again to access your courses and profile.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg"
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

/* -------------------- Search Result Card Component -------------------- */
const SearchResultCard = ({ course, onClick }) => {
  const {
    id,
    title,
    thumbnailUrl,
    instructor,
    price,
    discountedPrice,
    rating,
    category,
  } = course;

  return (
    <div
      onClick={() => onClick(id)}
      className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={thumbnailUrl || "/default-course.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-1">
          {title}
        </h4>

        {instructor && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {instructor}
          </p>
        )}

        {category && (
          <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full mt-1">
            {category}
          </span>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div className="flex items-center gap-1">
            {discountedPrice ? (
              <>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  <HiOutlineCurrencyRupee
                    className="inline -mt-0.5"
                    size={12}
                  />
                  {discountedPrice}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                  <HiOutlineCurrencyRupee
                    className="inline -mt-0.5"
                    size={10}
                  />
                  {price}
                </span>
              </>
            ) : price ? (
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                <HiOutlineCurrencyRupee className="inline -mt-0.5" size={12} />
                {price}
              </span>
            ) : (
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                Free
              </span>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1">
              <FiStar size={12} className="text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------- Main Navbar Component -------------------- */
export default function Navbar() {
  const { isAuthenticated, user, logout, openLogin, openSignup } = useAuth();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { profile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Search related states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [popularTags, setPopularTags] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Mobile explore menu state
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);

  // Timer for hover delay
  const [exploreTimer, setExploreTimer] = useState(null);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close search with Escape
      if (e.key === "Escape") {
        setShowSearchResults(false);
        setSuggestions([]);
      }
      // Search with Enter
      if (
        e.key === "Enter" &&
        searchQuery.trim() &&
        e.target.tagName !== "TEXTAREA"
      ) {
        handleSearch(e);
      }
      // Focus search with Ctrl+K
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.querySelector(".search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  /* ---------------- LOAD COURSES FOR EXPLORE MENU ---------------- */
  useEffect(() => {
    loadExploreCourses();
    loadPopularTags();
  }, []);

  const loadExploreCourses = async () => {
    try {
      setCoursesLoading(true);
      const data = await getCourses();
      setAllCourses(data || []);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  const loadPopularTags = async () => {
    try {
      const tags = await getPopularTags();
      setPopularTags(tags.slice(0, 10));
    } catch (error) {
      console.error("Failed to load popular tags:", error);
      setPopularTags([
        "Java",
        "Python",
        "React",
        "JavaScript",
        "Web Development",
        "Testing",
        "SQL",
        "Data Science",
      ]);
    }
  };

  /* ---------------- FILTER COURSES BY SUBCATEGORY WITH KEYWORDS ---------------- */
  const getCoursesByCategory = (subCategory) => {
    if (!subCategory || !allCourses.length) return [];

    // Find keywords for this subcategory
    let keywords = [];
    Object.values(exploreCategories).forEach((mainCat) => {
      if (mainCat.subcategories && mainCat.subcategories[subCategory]) {
        keywords = mainCat.subcategories[subCategory].keywords || [];
      }
    });

    if (keywords.length === 0) return [];

    const filteredCourses = allCourses.filter((course) => {
      const searchableText = `
        ${course.title?.toLowerCase() || ""}
        ${course.description?.toLowerCase() || ""}
        ${course.category?.toLowerCase() || ""}
        ${(course.tags || []).join(" ").toLowerCase()}
      `;

      return keywords.some((keyword) =>
        searchableText.includes(keyword.toLowerCase()),
      );
    });

    return filteredCourses.slice(0, 6);
  };

  /* ---------------- AVATAR & USER INITIALS ---------------- */
  const getAvatar = () => {
    if (profile?.avatar) {
      if (typeof profile.avatar === "string") return profile.avatar;
      return URL.createObjectURL(profile.avatar);
    }
    return null;
  };

  const getUserInitials = () => {
    if (!user) return "";
    return (
      (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
    ).toUpperCase();
  };

  /* ---------------- UPDATED LOGOUT HANDLER ---------------- */
  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    console.log(" Logging out user...");

    logout();
    clearProfile();

    setShowLogoutConfirm(false);
    setMenuOpen(false);
    setShowUserMenu(false);

    navigate("/", { replace: true });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  /* ---------------- DEBOUNCED SEARCH HANDLER ---------------- */
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      setSuggestions([]);
      return;
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(async () => {
      if (value.trim().length > 1) {
        try {
          const suggestionsList = await getSearchSuggestions(value);
          setSuggestions(suggestionsList.slice(0, 5));
        } catch (error) {
          console.error("Suggestions failed:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSuggestions([]);
      return;
    }

    setLoadingSearch(true);
    const startTime = Date.now();

    try {
      const results = await searchCourses(query, user?.id);
      const searchDuration = Date.now() - startTime;

      console.log(`🔍 Search completed in ${searchDuration}ms`, {
        query,
        resultsCount: results.length,
        userId: user?.id,
      });

      setSearchResults(results);
      setShowSearchResults(true);
      setSuggestions([]);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);

    setLoadingSearch(true);
    searchCourses(suggestion, user?.id)
      .then((results) => {
        setSearchResults(results);
        setShowSearchResults(true);
      })
      .catch((error) => {
        console.error("Search failed:", error);
        setSearchResults([]);
        setShowSearchResults(true);
      })
      .finally(() => {
        setLoadingSearch(false);
      });
  };

  const handleTagClick = async (tag) => {
    setSearchQuery(tag);
    setLoadingSearch(true);
    setSuggestions([]);

    try {
      const results = await searchCourses(tag, user?.id);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
    setMenuOpen(false);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSuggestions([]);
  };

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSearchResults &&
        !event.target.closest(".search-container") &&
        !event.target.closest(".search-results-panel")
      ) {
        setShowSearchResults(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

  /* ---------------- CLOSE USER MENU ON CLICK OUTSIDE ---------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Cleanup effect for mobile explore menu
  useEffect(() => {
    return () => {
      setMobileExploreOpen(false);
    };
  }, []);

  /* ---------------- IMPROVED EXPLORE HOVER HANDLING ---------------- */
  const handleExploreMouseEnter = () => {
    // Clear any existing timer
    if (exploreTimer) {
      clearTimeout(exploreTimer);
      setExploreTimer(null);
    }
    
    // Show explore menu immediately
    setShowExplore(true);
  };

  const handleExploreMouseLeave = () => {
    // Set a delay before closing to allow user to move to menu
    const timer = setTimeout(() => {
      if (showExplore) {
        setShowExplore(false);
        setActiveMainCategory(null);
        setActiveSubCategory(null);
      }
    }, 150); // 150ms delay for smooth transition
    
    setExploreTimer(timer);
  };

  const handleExploreMenuMouseEnter = () => {
    // Clear the close timer if user enters the menu
    if (exploreTimer) {
      clearTimeout(exploreTimer);
      setExploreTimer(null);
    }
    
    // Ensure menu stays open
    setShowExplore(true);
  };

  const handleExploreMenuMouseLeave = () => {
    // Close menu immediately when leaving the menu area
    setShowExplore(false);
    setActiveMainCategory(null);
    setActiveSubCategory(null);
    
    // Clear any existing timer
    if (exploreTimer) {
      clearTimeout(exploreTimer);
      setExploreTimer(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[60px]">
        <div className="h-full bg-[#eaf9ff]/95 dark:bg-gray-900/95 backdrop-blur border-b border-black/10 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
            {/* LOGO */}
            <Link to="/">
              <img src={logo} alt="CDAXX" className="h-14 md:h-16" />
            </Link>

            {/* CENTER NAVIGATION */}
            <div className="hidden lg:flex flex-1 items-center gap-8 mx-4">
              <Link to="/">
                <button className="font-medium px-2 py-1 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </button>
              </Link>

              {/* EXPLORE MEGA MENU */}
              <div
                className="relative"
                onMouseEnter={handleExploreMouseEnter}
                onMouseLeave={handleExploreMouseLeave}
              >
                <button className="font-medium px-2 py-1 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Explore
                </button>

                {/* EXPLORE MENU CONTAINER - Added wrapper for better hover handling */}
                <div 
                  className="absolute left-0 top-full"
                  onMouseEnter={handleExploreMenuMouseEnter}
                  onMouseLeave={handleExploreMenuMouseLeave}
                >
                  <ExploreMenu
                    showExplore={showExplore}
                    setShowExplore={setShowExplore}
                    activeMainCategory={activeMainCategory}
                    setActiveMainCategory={setActiveMainCategory}
                    activeSubCategory={activeSubCategory}
                    setActiveSubCategory={setActiveSubCategory}
                    allCourses={allCourses}
                    coursesLoading={coursesLoading}
                    navigate={navigate}
                  />
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="search-container relative flex-1 max-w-xl">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses (e.g., Java, Testing, React)"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="search-input w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    >
                      <FiSearch size={16} />
                    </button>

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchResults(false);
                          setSearchResults([]);
                          setSuggestions([]);
                        }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                  </div>

                  {/* Search Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Suggestions
                        </h4>
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center gap-3"
                        >
                          <FiSearch className="text-gray-400" size={16} />
                          <span className="text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </form>

                {/* Search Results Panel */}
                {showSearchResults && (
                  <div className="search-results-panel absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden">
                    {/* Results Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Search Results
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {loadingSearch
                            ? "Searching..."
                            : `${searchResults.length} courses found`}
                        </p>
                      </div>
                      <button
                        onClick={closeSearchResults}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    {/* Loading State */}
                    {loadingSearch ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Searching for "{searchQuery}"...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="overflow-y-auto max-h-[400px]">
                        {/* Popular Tags */}
                        {popularTags.length > 0 && (
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Popular Topics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {popularTags.map((tag, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleTagClick(tag)}
                                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Course Results */}
                        <div>
                          {searchResults.map((course) => (
                            <SearchResultCard
                              key={course.id || course._id}
                              course={course}
                              onClick={handleCourseClick}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <FiSearch size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          No courses found
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          No results for "{searchQuery}". Try different
                          keywords.
                        </p>

                        {/* Search Suggestions */}
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Try searching for:
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {[
                              "Java Programming",
                              "JavaScript",
                              "React",
                              "Python",
                              "Web Development",
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setSearchQuery(suggestion);
                                  handleSearch({ preventDefault: () => {} });
                                }}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/plans-pricing"
                className="font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Plans & Pricing
              </Link>

              <Link
                to="/privacy-policy"
                className="font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy & Policy
              </Link>

              {/* FAVOURITES */}
              <Link to="/favourites" className="relative group">
                <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <HiHeart className="text-lg" />
                  <span>Favourites</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 dark:bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <HiOutlineShoppingCart size={18} />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 dark:bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </Link>

              {isAuthenticated && user ? (
                // USER IS LOGGED IN
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg"
                  >
                    {getAvatar() ? (
                      <img
                        src={getAvatar()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </button>

                  {/* USER DROPDOWN MENU */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HiHeart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        My Favourites
                        {favorites.length > 0 && (
                          <span className="ml-auto bg-blue-600 dark:bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
                            {favorites.length}
                          </span>
                        )}
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
                <>
                  <button
                    onClick={openLogin}
                    className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </button>

                  <button
                    onClick={openSignup}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden text-gray-800 dark:text-gray-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="lg:hidden px-4 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 bg-[#eaf9ff] dark:bg-gray-900">
              {/* MOBILE SEARCH BAR */}
              <div className="search-container pt-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 dark:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    <FiSearch size={18} />
                  </button>
                </form>

                {/* Mobile Search Results */}
                {showSearchResults && (
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        Search Results
                      </h4>
                      <button
                        onClick={closeSearchResults}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    {loadingSearch ? (
                      <div className="p-6 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Searching...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((course) => (
                          <div
                            key={course.id || course._id}
                            onClick={() =>
                              handleCourseClick(course.id || course._id)
                            }
                            className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <h5 className="font-medium text-gray-800 dark:text-white">
                              {course.title}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {course.category}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <FiSearch
                          size={32}
                          className="text-gray-400 mx-auto mb-3"
                        />
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                          No results found
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No courses match "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl">
                        {getAvatar() ? (
                          <img
                            src={getAvatar()}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
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
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
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
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
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
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiHeart className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    Favourites
                    {favorites.length > 0 && (
                      <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </Link>

                  {/* MOBILE EXPLORE BUTTON */}
                  <button
                    onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                    className="flex items-center justify-between w-full py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <span className="flex items-center gap-2">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Explore
                    </span>
                    {mobileExploreOpen ? <HiChevronDown /> : <HiChevronRight />}
                  </button>

                  {/* Mobile Explore Menu */}
                  <MobileExploreMenu
                    isOpen={mobileExploreOpen}
                    coursesLoading={coursesLoading}
                    getCoursesByCategory={getCoursesByCategory}
                    navigate={navigate}
                    setMenuOpen={setMenuOpen}
                    onClose={() => setMobileExploreOpen(false)}
                  />

                  <Link
                    to="/plans-pricing"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Plans & Pricing
                  </Link>

                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Privacy & Policy
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiOutlineShoppingCart size={18} />
                    Cart
                    {cart.length > 0 && (
                      <span className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white font-medium hover:from-red-700 hover:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 transition-all flex items-center justify-center gap-2"
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
                <>
                  {/* MOBILE EXPLORE BUTTON */}
                  <button
                    onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                    className="flex items-center justify-between w-full py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <span className="flex items-center gap-2">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Explore
                    </span>
                    {mobileExploreOpen ? <HiChevronDown /> : <HiChevronRight />}
                  </button>

                  {/* Mobile Explore Menu */}
                  <MobileExploreMenu
                    isOpen={mobileExploreOpen}
                    coursesLoading={coursesLoading}
                    getCoursesByCategory={getCoursesByCategory}
                    navigate={navigate}
                    setMenuOpen={setMenuOpen}
                    onClose={() => setMobileExploreOpen(false)}
                  />

                  <Link
                    to="/plans-pricing"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Plans & Pricing
                  </Link>

                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Privacy & Policy
                  </Link>

                  <Link
                    to="/favourites"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiHeart className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    Favourites
                    {favorites.length > 0 && (
                      <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HiOutlineShoppingCart size={18} />
                    Cart
                    {cart.length > 0 && (
                      <span className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  {/* LOGIN/SIGNUP BUTTONS */}
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => {
                        openLogin();
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        openSignup();
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white font-medium hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg"
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