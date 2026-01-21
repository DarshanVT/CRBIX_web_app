import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiOutlineBookOpen, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineRefresh,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiChevronRight,
  HiOutlineExclamationCircle,
  HiOutlineFire
} from "react-icons/hi";

import { useProfile } from "../components/Profile/ProfileContext";
import { useAuth } from "../components/Login/AuthContext";


export default function CoursesPage() {
  const { isAuthenticated, openLogin } = useAuth();
  const { 
    enrolledCourses, 
    loading, 
    fetchProfile,
    selectedCourseId,
    setSelectedCourseId,
    streakData,
    loadCourseStreak
  } = useProfile();
  
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
    } else {
      setLocalLoading(false);
    }
  }, [isAuthenticated]);

  const loadCourses = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      console.log(" Loading courses from ProfileContext");
      
      // ProfileContext se courses fetch karo
      await fetchProfile();
      
      console.log(" Courses loaded from ProfileContext:", enrolledCourses);
      
    } catch (err) {
      console.error(" Error loading courses:", err);
      setError(err.message || "Failed to load courses");
    } finally {
      setLocalLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const handleCourseClick = (courseId) => {
    if (setSelectedCourseId) {
      setSelectedCourseId(courseId);
    }
    
    if (loadCourseStreak) {
      loadCourseStreak(courseId);
    }
    
    navigate(`/course/${courseId}`);
  };

  const handleViewStreak = (courseId, e) => {
    e.stopPropagation();
    
    if (setSelectedCourseId) {
      setSelectedCourseId(courseId);
    }
    
    navigate(`/profile?view=streak&course=${courseId}`);
  };

  const filteredCourses = enrolledCourses.filter(course => {
    if (filter === "all") return true;
    if (filter === "in-progress") return (course.progressPercentage || course.progressPercent || 0) < 100;
    if (filter === "completed") return (course.progressPercentage || course.progressPercent || 0) === 100;
    return true;
  });

  const totalCourses = enrolledCourses.length;
  const inProgressCount = enrolledCourses.filter(c => (c.progressPercentage || c.progressPercent || 0) < 100 && (c.progressPercentage || c.progressPercent || 0) > 0).length;
  const completedCount = enrolledCourses.filter(c => (c.progressPercentage || c.progressPercent || 0) === 100).length;
  const notStartedCount = enrolledCourses.filter(c => (c.progressPercentage || c.progressPercent || 0) === 0).length;
  
  const averageProgress = totalCourses > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progressPercentage || course.progressPercent || 0), 0) / totalCourses)
    : 0;

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <HiOutlineAcademicCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Your Learning Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to view your enrolled courses
          </p>
          <button
            onClick={openLogin}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {totalCourses} enrolled courses • Average progress: {averageProgress}%
              {currentStreak > 0 && (
                <span className="ml-4 inline-flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <HiOutlineFire className="w-4 h-4" />
                  {currentStreak} day streak
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing || localLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <HiOutlineRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            {selectedCourseId && currentStreak > 0 && (
              <button
                onClick={() => navigate(`/profile?view=streak`)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <HiOutlineFire className="w-4 h-4" />
                View Streak
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-start gap-3">
              <HiOutlineExclamationCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-300">{error}</p>
                <p className="text-yellow-600 dark:text-yellow-500 text-sm mt-1">
                  Showing available course data from Profile
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HiOutlineBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HiOutlineChartBar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inProgressCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <HiOutlineCheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <HiOutlineFire className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStreak} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress Summary */}
        {totalCourses > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Overall Progress</h3>
            <div className="space-y-3">
              {enrolledCourses.map(course => {
                const progress = course.progressPercentage || course.progressPercent || 0;
                return (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {course.title}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            progress === 100
                              ? "bg-green-500"
                              : progress > 0
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-500"
            }`}
          >
            All Courses ({totalCourses})
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "in-progress"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-green-500"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "completed"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-purple-500"
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter("not-started")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "not-started"
                ? "bg-gray-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-gray-500"
            }`}
          >
            Not Started ({notStartedCount})
          </button>
        </div>

        {/* Loading State */}
        {(localLoading || loading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!(localLoading || loading) && (
          <>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <HiOutlineBookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {filter === "all" ? "No courses enrolled yet" : `No ${filter.replace('-', ' ')} courses`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                  {filter === "all" 
                    ? "Start your learning journey by enrolling in courses that interest you"
                    : `You don't have any ${filter.replace('-', ' ')} courses at the moment`
                  }
                </p>
                {filter !== "all" ? (
                  <button
                    onClick={() => setFilter("all")}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
                  >
                    View All Courses
                  </button>
                ) : (
                  <Link
                    to="/explore-courses"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
                  >
                    <HiOutlineAcademicCap className="w-5 h-5" />
                    Browse All Courses
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const progress = course.progressPercentage || course.progressPercent || 0;
                  const isCompleted = progress === 100;
                  const isInProgress = progress > 0 && progress < 100;
                  const isNotStarted = progress === 0;

                  const hasStreak = selectedCourseId === course.id && streakData;
                  
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      {/* Streak badge */}
                      {hasStreak && streakData.currentStreak > 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <button
                            onClick={(e) => handleViewStreak(course.id, e)}
                            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full hover:from-orange-600 hover:to-orange-700 transition-all"
                          >
                            <HiOutlineFire className="w-3 h-3" />
                            {streakData.currentStreak} day streak
                          </button>
                        </div>
                      )}
                      
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={course.thumbnailUrl || course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                            {course.category || 'Course'}
                          </span>
                        </div>
                        {isCompleted && (
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                              <HiOutlineCheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      
                      {course.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            {isCompleted ? 'Completed' : 
                             isInProgress ? 'In Progress' : 
                             'Not Started'}
                          </span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isCompleted
                                ? "bg-green-500"
                                : isInProgress
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            {course.totalLessons && (
                              <span className="flex items-center gap-1">
                                <HiOutlineBookOpen className="w-4 h-4" />
                                {course.completedLessons || Math.floor((progress/100) * course.totalLessons)}/{course.totalLessons} lessons
                              </span>
                            )}
                            {course.duration && (
                              <span className="flex items-center gap-1">
                                <HiOutlineClock className="w-4 h-4" />
                                {course.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <HiChevronRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.id);
                          }}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                          {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                        </button>
                        
                        {hasStreak && streakData && (
                          <button
                            onClick={(e) => handleViewStreak(course.id, e)}
                            className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors flex items-center gap-1"
                          >
                            <HiOutlineFire className="w-3 h-3" />
                            Streak
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Continue Learning Section */}
        {!(localLoading || loading) && inProgressCount > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses
                .filter(c => {
                  const progress = c.progressPercentage || c.progressPercent || 0;
                  return progress > 0 && progress < 100;
                })
                .slice(0, 2)
                .map((course) => {
                  const progress = course.progressPercentage || course.progressPercent || 0;
                  return (
                    <div
                      key={course.id}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="flex gap-4">
                        <img
                          src={course.thumbnailUrl || course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                          alt={course.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h3>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">
                                {course.completedLessons || Math.floor((progress/100) * (course.totalLessons || 50))}/{course.totalLessons || 50} lessons
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {progress}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCourseClick(course.id);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Continue Learning
                            </button>
                            
                            {selectedCourseId === course.id && streakData?.currentStreak > 0 && (
                              <button
                                onClick={(e) => handleViewStreak(course.id, e)}
                                className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors flex items-center gap-1"
                              >
                                <HiOutlineFire className="w-4 h-4" />
                                {streakData.currentStreak} day streak
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Completed Courses Section */}
        {!(localLoading || loading) && completedCount > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recently Completed
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses
                .filter(c => (c.progressPercentage || c.progressPercent || 0) === 100)
                .slice(0, 2)
                .map((course) => (
                  <div
                    key={course.id}
                    className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={course.thumbnailUrl || course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                          alt={course.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <HiOutlineCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Successfully completed! You've mastered this course.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.id);
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Review Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}