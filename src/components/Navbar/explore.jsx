import React, { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// Explore Categories Data
export const exploreCategories = {
  Courses: {
    subcategories: {
      "Web Development": {
        keywords: [
          "web",
          "react",
          "javascript",
          "html",
          "css",
          "frontend",
          "backend",
          "node",
          "vue",
          "angular",
        ],
      },
      "Programming Languages": {
        keywords: [
          "java",
          "python",
          "c++",
          "c#",
          "javascript",
          "typescript",
          "go",
          "ruby",
          "swift",
          "kotlin",
        ],
      },
      "Mobile Development": {
        keywords: [
          "mobile",
          "android",
          "ios",
          "react native",
          "flutter",
          "kotlin",
          "swift",
          "xamarin",
        ],
      },
      "Software Testing": {
        keywords: [
          "testing",
          "qa",
          "selenium",
          "test",
          "automation",
          "manual",
          "java",
          "python",
          "junit",
          "testng",
        ],
      },
      "Data Analytics": {
        keywords: [
          "data",
          "analytics",
          "analysis",
          "sql",
          "excel",
          "power bi",
          "tableau",
          "business intelligence",
        ],
      },
      "Data Science": {
        keywords: [
          "data science",
          "machine learning",
          "ai",
          "statistics",
          "python",
          "r",
          "tensorflow",
          "pytorch",
        ],
      },
      "UI/UX Design": {
        keywords: [
          "ui",
          "ux",
          "design",
          "figma",
          "prototype",
          "wireframe",
          "user experience",
          "adobe xd",
        ],
      },
      "AI & Machine Learning": {
        keywords: [
          "ai",
          "artificial intelligence",
          "machine learning",
          "deep learning",
          "neural network",
          "tensorflow",
          "pytorch",
        ],
      },
      "Database Management": {
        keywords: [
          "database",
          "sql",
          "mysql",
          "mongodb",
          "postgresql",
          "oracle",
          "nosql",
          "redis",
        ],
      },
      "Computer Networking": {
        keywords: [
          "networking",
          "network",
          "ccna",
          "tcp/ip",
          "firewall",
          "security",
          "aws",
          "azure",
          "cloud",
        ],
      },
    },
  },
  Placement: {
    subcategories: {
      "Interview Preparation": {
        keywords: [
          "interview",
          "resume",
          "hr",
          "technical",
          "mock",
          "placement",
          "career",
        ],
      },
      "Company Specific Prep": {
        keywords: [
          "faang",
          "google",
          "amazon",
          "microsoft",
          "facebook",
          "apple",
          "netflix",
          "top companies",
        ],
      },
      "Coding Practice": {
        keywords: [
          "leetcode",
          "hackerrank",
          "codechef",
          "competitive",
          "dsa",
          "algorithms",
          "problems",
        ],
      },
      "Soft Skills": {
        keywords: [
          "communication",
          "leadership",
          "teamwork",
          "presentation",
          "body language",
          "confidence",
        ],
      },
    },
  },
  Services: {
    subcategories: {
      "Career Counseling": {
        keywords: [
          "career",
          "guidance",
          "counseling",
          "mentorship",
          "roadmap",
          "planning",
        ],
      },
      "Project Guidance": {
        keywords: [
          "project",
          "guidance",
          "implementation",
          "real world",
          "portfolio",
          "github",
        ],
      },
      "Doubt Support": {
        keywords: [
          "doubt",
          "support",
          "query",
          "help",
          "clarification",
          "assistance",
        ],
      },
      "Live Sessions": {
        keywords: [
          "live",
          "sessions",
          "webinar",
          "workshop",
          "interactive",
          "qna",
        ],
      },
    },
  },
  "Certification Enquiry": {
    subcategories: {
      "Course Certificates": {
        keywords: [
          "certificate",
          "completion",
          "course",
          "certification",
          "verify",
          "accreditation",
        ],
      },
      "Industry Certifications": {
        keywords: [
          "aws",
          "google",
          "microsoft",
          "oracle",
          "cisco",
          "comptia",
          "industry",
          "recognized",
        ],
      },
      "Verification Process": {
        keywords: [
          "verify",
          "authentication",
          "process",
          "steps",
          "documentation",
          "requirements",
        ],
      },
      "Contact Support": {
        keywords: [
          "contact",
          "support",
          "help",
          "assistance",
          "email",
          "phone",
          "query",
        ],
      },
    },
  },
};

// Explore Menu Component
const ExploreMenu = ({
  showExplore,
  setShowExplore,
  activeMainCategory,
  setActiveMainCategory,
  activeSubCategory,
  setActiveSubCategory,
  allCourses,
  coursesLoading,
  navigate,
}) => {
  
  // Filter courses by subcategory with keywords
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

  if (!showExplore) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full mt-3 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50"
      onMouseEnter={() => setShowExplore(true)}
      onMouseLeave={() => {
        setShowExplore(false);
        setActiveMainCategory(null);
        setActiveSubCategory(null);
      }}
    >
      <div className="flex min-h-[300px]">
        {/* LEFT – ONLY MAIN CATEGORIES */}
        <div className="w-[250px]">
          {Object.keys(exploreCategories).map((mainCategory) => (
            <div
              key={mainCategory}
              onMouseEnter={() => {
                setActiveMainCategory(mainCategory);
                setActiveSubCategory(null);
              }}
              className={`px-5 py-3 cursor-pointer text-sm font-medium border-r border-gray-200 dark:border-gray-700 transition-all duration-150
                ${
                  activeMainCategory === mainCategory
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              <div className="flex items-center justify-between">
                <span>{mainCategory}</span>
                <HiChevronRight className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE – SUBCATEGORIES */}
        <AnimatePresence mode="wait">
          {activeMainCategory && (
            <motion.div
              key="subcategories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="w-[300px] p-5 border-r border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-lg">
                {activeMainCategory}
              </h3>
              <ul className="space-y-1">
                {Object.keys(
                  exploreCategories[activeMainCategory].subcategories,
                ).map((subCategory) => (
                  <li
                    key={subCategory}
                    onMouseEnter={() => setActiveSubCategory(subCategory)}
                    className={`px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-all duration-150
                      ${
                        activeSubCategory === subCategory
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{subCategory}</span>
                      <HiChevronRight className="text-xs" />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT – CONTENT */}
        <AnimatePresence mode="wait">
          {activeMainCategory && activeSubCategory && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="w-[350px] p-5"
            >
              {activeMainCategory === "Courses" ? (
                <>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {activeSubCategory} Courses
                  </h4>
                  {coursesLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading courses...
                      </p>
                    </div>
                  ) : getCoursesByCategory(activeSubCategory).length === 0 ? (
                    <div className="text-center py-6">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        No courses found for "{activeSubCategory}"
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Try selecting a different category
                      </p>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-3 mb-4">
                        {getCoursesByCategory(activeSubCategory).map((course) => (
                          <li
                            key={course.id || course._id}
                            onClick={() => {
                              navigate(`/course/${course.id || course._id}`);
                              setShowExplore(false);
                              setActiveMainCategory(null);
                              setActiveSubCategory(null);
                            }}
                            className="cursor-pointer flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150"
                          >
                            <span className="truncate mr-2">{course.title}</span>
                            <HiChevronRight className="text-gray-300 flex-shrink-0" />
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          navigate(
                            `/courses?category=${encodeURIComponent(activeSubCategory)}`,
                          );
                          setShowExplore(false);
                          setActiveMainCategory(null);
                          setActiveSubCategory(null);
                        }}
                        className="w-full py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-150 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                      >
                        View all courses →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {activeSubCategory}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {activeMainCategory === "Placement"
                      ? `Get expert guidance for ${activeSubCategory.toLowerCase()}. Our placement team helps you prepare for interviews, build your resume, and land your dream job.`
                      : activeMainCategory === "Services"
                      ? `Our ${activeSubCategory.toLowerCase()} services provide personalized support to help you succeed in your learning journey.`
                      : `Get information about ${activeSubCategory.toLowerCase()} and how to obtain your certification.`}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-4">
                    {activeMainCategory === "Placement" && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mock Interviews
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Resume Building
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Company-specific Prep
                        </li>
                      </>
                    )}
                  </ul>

                  <button
                    onClick={() => {
                      if (activeMainCategory === "Placement") {
                        navigate("/placement");
                      } else if (activeMainCategory === "Services") {
                        navigate("/services");
                      } else if (activeMainCategory === "Certification Enquiry") {
                        navigate("/certifications");
                      }
                      setShowExplore(false);
                      setActiveMainCategory(null);
                      setActiveSubCategory(null);
                    }}
                    className="w-full py-2.5 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-150 shadow-sm hover:shadow"
                  >
                    Explore {activeMainCategory} →
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY STATE - REMOVED as requested */}
      </div>
    </motion.div>
  );
};

// Mobile Explore Menu Component
export const MobileExploreMenu = ({
  isOpen,
  coursesLoading,
  getCoursesByCategory,
  navigate,
  setMenuOpen,
  onClose,
}) => {
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const handleMainCategoryClick = (category) => {
    if (activeMainCategory === category) {
      setActiveMainCategory(null);
      setActiveSubCategory(null);
    } else {
      setActiveMainCategory(category);
      setActiveSubCategory(null);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    if (activeSubCategory === subCategory) {
      setActiveSubCategory(null);
    } else {
      setActiveSubCategory(subCategory);
    }
  };

  const handleViewAll = (category) => {
    navigate(`/courses?category=${encodeURIComponent(category)}`);
    setActiveMainCategory(null);
    setActiveSubCategory(null);
    onClose();
    setMenuOpen(false);
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id || course._id}`);
    setActiveMainCategory(null);
    setActiveSubCategory(null);
    onClose();
    setMenuOpen(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-2 overflow-hidden"
    >
      <div className="max-h-80 overflow-y-auto">
        {Object.keys(exploreCategories).map((mainCategory) => (
          <div
            key={mainCategory}
            className="border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            {/* Main Category Button */}
            <button
              onClick={() => handleMainCategoryClick(mainCategory)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-white">
                {mainCategory}
              </span>
              <HiChevronRight
                className={`transition-transform duration-150 ${activeMainCategory === mainCategory ? "rotate-90" : ""}`}
              />
            </button>

            {/* Subcategories - Collapsible */}
            {activeMainCategory === mainCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="px-4 pb-3 bg-gray-50 dark:bg-gray-900/50"
              >
                {Object.keys(exploreCategories[mainCategory].subcategories).map(
                  (subCategory) => (
                    <div key={subCategory} className="mb-2 last:mb-0">
                      <button
                        onClick={() => handleSubCategoryClick(subCategory)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {subCategory}
                        </span>
                        <HiChevronRight
                          className={`transition-transform duration-150 text-xs ${activeSubCategory === subCategory ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* Courses for this subcategory - Collapsible */}
                      {activeSubCategory === subCategory &&
                        mainCategory === "Courses" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-4 mt-2"
                          >
                            {coursesLoading ? (
                              <div className="py-2 text-center">
                                <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Loading...
                                </p>
                              </div>
                            ) : getCoursesByCategory(subCategory).length ===
                              0 ? (
                              <p className="text-xs text-gray-500 dark:text-gray-400 py-2 text-center">
                                No courses available
                              </p>
                            ) : (
                              <>
                                <ul className="space-y-1 py-1">
                                  {getCoursesByCategory(subCategory)
                                    .slice(0, 3)
                                    .map((course) => (
                                      <li
                                        key={course.id || course._id}
                                        onClick={() =>
                                          handleCourseClick(course)
                                        }
                                        className="cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                          {course.title}
                                        </p>
                                      </li>
                                    ))}
                                </ul>

                                <button
                                  onClick={() => handleViewAll(subCategory)}
                                  className="w-full mt-1 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                >
                                  View all →
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}

                      {/* For other main categories (not Courses) */}
                      {activeSubCategory === subCategory &&
                        mainCategory !== "Courses" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-4 mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                          >
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Explore our {subCategory.toLowerCase()} services
                            </p>
                            <button
                              onClick={() => {
                                if (mainCategory === "Placement") {
                                  navigate("/placement");
                                } else if (mainCategory === "Services") {
                                  navigate("/services");
                                } else if (
                                  mainCategory === "Certification Enquiry"
                                ) {
                                  navigate("/certification");
                                }
                                setActiveMainCategory(null);
                                setActiveSubCategory(null);
                                onClose();
                                setMenuOpen(false);
                              }}
                              className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                            >
                              Learn more →
                            </button>
                          </motion.div>
                        )}
                    </div>
                  ),
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExploreMenu;