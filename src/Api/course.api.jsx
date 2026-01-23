import api from "./api";

/* ==================== COURSES ==================== */

export const getCourses = async (userId = null) => {
  try {
    console.log(" getCourses called with userId:", userId);

    const params = {};
    if (userId) {
      params.userId = userId;
      console.log(" Sending userId:", userId);
    }

    console.log(" Making API call to /courses with params:", params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await api.get("/courses", {
      params,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(" API Response received:", {
      status: res.status,
      dataLength: res.data?.data?.length,
      firstCourse: res.data?.data?.[0],
    });

    return res.data?.data ?? [];
  } catch (err) {
    console.error(" Failed to fetch courses:", {
      error: err.message,
      isNetworkError: !err.response,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config,
    });

    if (err.message.includes("Network Error")) {
      console.error(
        " Network Error - Check if backend is running and CORS is configured",
      );
      console.error(" Backend URL should be: http://localhost:8080");
    }

    return [];
  }
};

export const getCourseById = async (courseId, userId) => {
  try {
    console.log(` Fetching course ${courseId} for user ${userId}`);

    const token = localStorage.getItem("auth_token");
    const response = await api.get(`/courses/${courseId}`, {
      params: userId ? { userId } : {},
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" Course API Response:", {
      status: response.status,
      data: response.data,
      hasData: !!response.data,
      hasNestedData: !!response.data?.data,
      hasModules: !!response.data?.data?.modules,
      modulesCount: response.data?.data?.modules?.length || 0,
    });

    const courseData = response.data?.data || response.data;

    if (courseData && !courseData.modules) {
      courseData.modules = [];
    }

    return courseData;
  } catch (error) {
    console.error(" Error fetching course:", error);

    return {
      id: courseId,
      title: "Course",
      modules: [],
    };
  }
};

export const getDashboardCourses = async (userId) => {
  try {
    const res = await api.get("/dashboard/courses", {
      params: { userId: userId },
    });
    return res.data?.data ?? [];
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
    return [];
  }
};

/* ==================== CART ==================== */

export const getCart = async (userId) => {
  try {
    const res = await api.get(`/cart/${userId}`);
    return res.data ?? [];
  } catch (err) {
    console.error("Cart fetch failed:", err);
    return [];
  }
};

export const getCartSummary = async (userId) => {
  try {
    const res = await api.get(`/cart/${userId}/summary`);
    return res.data ?? null;
  } catch (err) {
    console.error("Cart summary failed:", err);
    return null;
  }
};

export const addToCart = async (userId, courseId) => {
  try {
    const res = await api.post(`/cart/${userId}/add/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("Add to cart failed:", err);
    return null;
  }
};

export const removeFromCart = async (userId, courseId) => {
  try {
    await api.delete(`/cart/${userId}/remove/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Remove from cart failed:", err);
    return { success: false };
  }
};

export const clearCart = async (userId) => {
  try {
    await api.delete(`/cart/${userId}/clear`);
    return { success: true };
  } catch (err) {
    console.error("Clear cart failed:", err);
    return { success: false };
  }
};

/* ==================== PURCHASE ==================== */

export const purchaseCourse = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");

    if (!userId || userId === "null") {
      throw new Error("User ID not found. Please login again.");
    }

    const res = await api.post(`/purchase`, null, {
      params: {
        userId: userId,
        courseId: courseId,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Purchase successful",
      data: res.data,
    };
  } catch (err) {
    console.error("Purchase failed:", err);
    return {
      success: false,
      message:
        err.response?.data?.message || "Purchase failed. Please try again.",
    };
  }
};

export const getPurchasedCourses = async (userId) => {
  try {
    console.log(` API: Fetching subscribed courses for user ${userId}`);
    console.log(` Making request to: /courses/subscribed/${userId}`);

    const token = localStorage.getItem("auth_token");
    console.log(` Token exists: ${!!token}`);

    const baseUrl = api.defaults.baseURL || "http://localhost:8080";
    const fullUrl = `${baseUrl}/api/courses/subscribed/${userId}`;
    console.log(` Full URL: ${fullUrl}`);

    const response = await api.get(`/courses/subscribed/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" API Response - Status:", response.status);
    console.log(" API Response - Headers:", response.headers);
    console.log(" API Response - Data:", response.data);
    console.log(" API Response - Data.data:", response.data?.data);

    return response.data || [];
  } catch (err) {
    console.error(" Get purchased courses failed:", err);

    if (err.response) {
      console.error(" Error response:", {
        status: err.response.status,
        data: err.response.data,
        url: err.response.config?.url,
      });
    } else if (err.request) {
      console.error(" No response received:", err.request);
    } else {
      console.error(" Request setup error:", err.message);
    }

    return [];
  }
};

export const isCoursePurchased = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/courses/${courseId}`, {
      params: { userId: userId },
    });

    const courseData = res.data?.data;
    return courseData?.isPurchased || false;
  } catch (err) {
    console.error("Check purchase status failed:", err);
    return false;
  }
};

/* ==================== FAVORITES ==================== */

export const getFavorites = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return [];

    const res = await api.get(`/favorites/${userId}`);
    return res.data ?? [];
  } catch (err) {
    console.error("Favorites fetch failed:", err);
    return [];
  }
};

export const addToFavorite = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    const res = await api.post(`/favorites/${userId}/add/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("Add to favorite failed:", err);
    return null;
  }
};

export const removeFromFavorites = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    await api.delete(`/favorites/${userId}/remove/${courseId}`);
    return { success: true };
  } catch (err) {
    console.error("Remove from favorites failed:", err);
    return { success: false };
  }
};

/* ==================== PROGRESS & STREAK ==================== */

export const getCourseProgress = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/course/${courseId}/progress`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Course progress failed:", err);
    return null;
  }
};

export const getUserOverallProgress = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/user/${userId}/progress/overall`);
    return res.data;
  } catch (err) {
    console.error("Overall progress failed:", err);
    return null;
  }
};

export const getStreak = async (courseId = null) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const params = { userId: userId };
    if (courseId) params.courseId = courseId;

    const res = await api.get(`/profile/streak`, { params: params });
    return res.data;
  } catch (err) {
    console.error("Streak fetch failed:", err);
    return null;
  }
};

export const getDashboardStats = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/dashboard/stats`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Dashboard stats failed:", err);
    return null;
  }
};

/* ==================== MODULE & VIDEO ==================== */

export const getModulesByCourse = async (courseId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/modules/course/${courseId}`, {
      params: { userId: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Get modules failed:", err);
    return null;
  }
};

export const getModuleById = async (moduleId) => {
  try {
    const res = await api.get(`/modules/${moduleId}`);
    return res.data;
  } catch (err) {
    console.error("Get module by ID failed:", err);
    return null;
  }
};

export const unlockNextModule = async (courseId, moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/modules/${moduleId}/unlock-next`, null, {
      params: {
        userId: userId,
        courseId: courseId,
      },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock module failed:", err);
    return false;
  }
};

export const unlockAssessment = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/modules/${moduleId}/unlock-assessment`, null, {
      params: { userId: userId },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock assessment failed:", err);
    return false;
  }
};

/* ==================== VIDEO PROGRESS & COMPLETION ==================== */

export const updateVideoProgress = async (
  userId,
  videoId,
  watchedSeconds,
  lastPositionSeconds,
  forwardJumpsCount = 0,
) => {
  try {
    const res = await api.post(`/videos/${videoId}/progress`, {
      userId,
      watchedSeconds,
      lastPositionSeconds,
      forwardJumpsCount,
    });

    return res.data;
  } catch (err) {
    console.error("Video progress update failed", err);
    return null;
  }
};

export const seekVideo = async (userId, videoId, seekPositionSeconds) => {
  try {
    const res = await api.post(`/videos/${videoId}/seek`, {
      userId,
      lastPositionSeconds: seekPositionSeconds,
      forwardJump: true,
    });

    return { success: res.data?.success ?? true };
  } catch (err) {
    console.error("Video seek failed:", err);
    return { success: false };
  }
};

/* ==================== VIDEO COMPLETION - FIXED VERSION ==================== */

export const completeVideo = async (userId, courseId, moduleId, videoId) => {
  try {
    console.log(" VIDEO COMPLETION REQUEST:", {
      userId,
      courseId,
      moduleId,
      videoId,
      timestamp: new Date().toISOString(),
    });

    if (!userId || !videoId) {
      console.error(" Missing required parameters for video completion");
      return {
        success: false,
        message: "Missing user ID or video ID",
      };
    }

    const res = await api.post(`/videos/${videoId}/complete`, null, {
      params: {
        userId,
        courseId: courseId || undefined,
        moduleId: moduleId || undefined,
      },
    });

    console.log(" VIDEO COMPLETION RESPONSE:", {
      status: res.status,
      data: res.data,
      success: res.data?.success,
      completed: res.data?.completed,
      unlocked: res.data?.unlocked,
    });

    return {
      success: res.data?.success || false,
      completed: res.data?.completed || false,
      unlocked: res.data?.unlocked || false,
      message: res.data?.message || "Video completion processed",
      data: res.data,
    };
  } catch (err) {
    console.error(" VIDEO COMPLETION FAILED:", {
      error: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config,
      url: err.config?.url,
      params: err.config?.params,
    });

    if (err.response?.status === 401) {
      return {
        success: false,
        message: "Authentication failed. Please login again.",
        error: "UNAUTHORIZED",
      };
    }

    if (err.response?.status === 400) {
      return {
        success: false,
        message: err.response?.data?.error || "Invalid request",
        error: "BAD_REQUEST",
      };
    }

    return {
      success: false,
      message: "Failed to complete video. Please try again.",
      error: err.message,
    };
  }
};

/* ==================== ASSESSMENT ==================== */

export const getAssessmentStatus = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get("/course/assessment/status", {
      params: { userId, assessmentId },
    });

    return res.data?.data ?? null;
  } catch (err) {
    console.error("Assessment status fetch failed:", err);
    return null;
  }
};

export const canAttemptAssessment = async (assessmentId, userId) => {
  try {
    console.log('🔍 CAN ATTEMPT ASSESSMENT - Starting call...');
    console.log('   Assessment ID:', assessmentId);
    console.log('   User ID:', userId);
    
    // Make sure we have both parameters
    if (!assessmentId || !userId) {
      console.error('❌ Missing parameters:', { assessmentId, userId });
      return false;
    }
    
    // The backend expects BOTH assessmentId AND userId
    const res = await api.get("/course/assessment/can-attempt", {
      params: {
        assessmentId,
        userId  // ✅ ADD THIS - You're missing it!
      }
    });

    console.log('✅ CAN ATTEMPT RESPONSE:', res.data);
    return res.data?.canAttempt ?? false;
    
  } catch (err) {
    console.error("❌ Assessment canAttempt failed:", {
      error: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
      params: err.config?.params  // Check what params were sent
    });
    
    return false;
  }
};

// Helper function to transform backend questions to frontend format
export const transformQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];
  
  return questions.map(question => {
    // Extract options from different possible field formats
    const extractOptions = (q) => {
      // Try different patterns for option fields
      const patterns = [
        // Standard camelCase
        ['optionA', 'optionB', 'optionC', 'optionD'],
        // Lowercase
        ['optiona', 'optionb', 'optionc', 'optiond'],
        // With underscores
        ['option_a', 'option_b', 'option_c', 'option_d'],
        // Mixed
        ['option_A', 'option_B', 'option_C', 'option_D']
      ];
      
      for (const pattern of patterns) {
        const options = pattern
          .map(field => q[field])
          .filter(value => value !== undefined && value !== null && value !== '');
        
        if (options.length >= 2) { // At least 2 options found
          return options;
        }
      }
      
      // Check if already has options array
      if (Array.isArray(q.options)) {
        return q.options;
      }
      
      // Return empty array as fallback
      return [];
    };
    
    return {
      id: question.id,
      questionText: question.questionText || question.question_text || '',
      options: extractOptions(question),
      correctAnswer: question.correctAnswer || question.correct_answer || '',
      marks: question.marks || 0,
      questionType: question.questionType || 'multiple_choice',
      explanation: question.explanation || '',
      // Keep all original properties
      ...question
    };
  });
};

export const getAssessmentQuestions = async (assessmentId, userId) => {
  try {
    console.log('🎯 GET ASSESSMENT QUESTIONS - API Call:');
    console.log('   Assessment ID:', assessmentId);
    console.log('   User ID:', userId);
    
    const res = await api.get(`/assessments/${assessmentId}/questions`, {
      params: { userId }
    });

    console.log('✅ API Response Structure:', {
      status: res.status,
      dataKeys: Object.keys(res.data),
      hasQuestions: Array.isArray(res.data?.questions),
      questionCount: res.data?.questions?.length || 0
    });
    
    // Log first question to see field names
    if (res.data?.questions?.[0]) {
      const firstQ = res.data.questions[0];
      console.log('🔍 First Question Field Names:', Object.keys(firstQ));
      console.log('🔍 First Question Values:', {
        id: firstQ.id,
        question_text: firstQ.question_text,
        option_a: firstQ.option_a,
        option_b: firstQ.option_b,
        option_c: firstQ.option_c,
        option_d: firstQ.option_d,
        correct_answer: firstQ.correct_answer
      });
    }
    
    return res.data;
    
  } catch (err) {
    console.error("❌ Failed to get assessment questions:", err);
    throw err;
  }
};
// Mock questions for testing
const getMockQuestions = (assessmentId) => {
  const mockQuestions = [
    {
      id: 1,
      questionText: "What is Java primarily known for?",
      options: [
        "Platform independence",
        "Speed of execution", 
        "Ease of learning",
        "Small memory footprint"
      ],
      correctAnswer: "Platform independence",
      marks: 2,
      assessmentId: assessmentId
    },
    {
      id: 2,
      questionText: "Which of these is NOT a Java keyword?",
      options: ["class", "object", "interface", "extends"],
      correctAnswer: "object",
      marks: 2,
      assessmentId: assessmentId
    },
    {
      id: 3,
      questionText: "What is JVM?",
      options: [
        "Java Virtual Machine",
        "Java Variable Manager",
        "Java Visual Machine",
        "Java Version Manager"
      ],
      correctAnswer: "Java Virtual Machine",
      marks: 2,
      assessmentId: assessmentId
    }
  ];
  
  return {
    success: true,
    questions: mockQuestions,
    totalQuestions: mockQuestions.length,
    totalMarks: mockQuestions.reduce((sum, q) => sum + q.marks, 0),
    message: "Mock questions loaded for testing"
  };
};

export const submitAssessment = async (assessmentId, userId, answers) => {
  try {
    console.log('📤 SUBMIT ASSESSMENT - API Call:');
    console.log('   Assessment ID:', assessmentId);
    console.log('   User ID:', userId);
    console.log('   Answers object:', answers);
    
    // The backend expects answers in format: {questionId1: "answerText", questionId2: "answerText"}
    // Make sure we're sending string values
    const formattedAnswers = {};
    Object.keys(answers).forEach(questionId => {
      formattedAnswers[questionId] = answers[questionId] || "";
    });
    
    console.log('   Formatted answers:', formattedAnswers);
    
    const res = await api.post("/course/assessment/submit", formattedAnswers, {
      params: {
        assessmentId,
        userId
      }
    });

    console.log('✅ SUBMISSION RESPONSE:', res.data);
    return res.data;
    
  } catch (err) {
    console.error("❌ Failed to submit assessment:", {
      error: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url
    });
    
    // Return mock result for testing if API fails
    console.warn('⚠️ Using mock submission result for testing');
    return getMockSubmissionResult(assessmentId, userId, answers);
  }
};

// Mock submission result for testing
const getMockSubmissionResult = (assessmentId, userId, answers) => {
  console.log('🔬 Analyzing answers for mock result:', answers);
  
  // For testing: Let's assume correct answer is always "Option B (Correct)"
  let correctCount = 0;
  let totalMarks = 0;
  const questionResults = [];
  
  Object.keys(answers).forEach((questionId, index) => {
    const userAnswer = answers[questionId];
    const isCorrect = userAnswer === "Option B (Correct)";
    
    if (isCorrect) {
      correctCount++;
      totalMarks += 2; // Assuming 2 marks per question
    }
    
    questionResults.push({
      questionId: questionId,
      correct: isCorrect,
      userAnswer: userAnswer,
      correctAnswer: "Option B (Correct)"
    });
  });
  
  const totalQuestions = Object.keys(answers).length;
  const percentage = (correctCount / totalQuestions) * 100;
  const passed = percentage >= 70;
  
  return {
    success: true,
    passed: passed,
    obtainedMarks: totalMarks,
    totalMarks: totalQuestions * 2,
    percentage: percentage,
    correctAnswers: correctCount,
    totalQuestions: totalQuestions,
    questionResults: questionResults,
    message: passed ? "Congratulations! You passed the assessment." : "Try again to improve your score."
  };
};

// In course.api.js - Update the getModuleAssessments function:

export const getModuleAssessments = async (moduleId, userId = null) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('❌ No auth token found for module assessments');
      return [];
    }

    console.log('📚 GET MODULE ASSESSMENTS:', {
      moduleId,
      userId,
      hasToken: !!token,
      tokenPreview: token.substring(0, 20) + '...'
    });

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`  // ✅ ADD AUTHORIZATION HEADER
      }
    };

    // Add userId as param if provided
    if (userId) {
      config.params = { userId };
    }

    const res = await api.get(`/modules/${moduleId}/assessments`, config);
    
    console.log('✅ MODULE ASSESSMENTS RESPONSE:', {
      status: res.status,
      data: res.data,
      isArray: Array.isArray(res.data),
      length: Array.isArray(res.data) ? res.data.length : 'not array'
    });

    return Array.isArray(res.data) ? res.data : (res.data?.data || []);
  } catch (error) {
    console.error(`❌ Error fetching assessments for module ${moduleId}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers
    });
    
    // // If endpoint doesn't exist, return mock data for testing
    // if (error.response?.status === 401) {
    //   console.error('⚠️ Authentication failed - token may be invalid or expired');
    //   // Optionally clear token and redirect to login
    //   localStorage.removeItem('auth_token');
    //   localStorage.removeItem('user_id');
    //   window.location.href = '/login';
    // }
    
    if (error.response?.status === 404) {
      console.warn('⚠️ Assessments endpoint not found, returning mock data');
      return [
        {
          id: moduleId,
          title: `Assessment - Module ${moduleId}`,
          description: "Test your knowledge",
          totalMarks: 20,
          totalQuestions: 10,
          duration: 1800, 
          passingMarks: 12,
          isLocked: false
        }
      ];
    }
    
    return [];
  }
};

export const getAssessmentDetails = async (assessmentId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/assessments/${assessmentId}`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    console.error("Get assessment details failed:", err);
    return null;
  }
};

export const checkModuleCompletion = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/modules/${moduleId}/completion`, {
      params: { userId },
    });
    return res.data?.completed || false;
  } catch (err) {
    console.error("Check module completion failed:", err);
    return false;
  }
};

export const checkAssessmentUnlock = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/course/assessment/can-attempt`, {
      params: {
        userId,
        assessmentId: moduleId,
      },
    });
    return res.data?.canAttempt || false;
  } catch (err) {
    console.error("Check assessment unlock failed:", err);
    return false;
  }
};

export const submitAssessmentAnswer = async (assessmentId, answers) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.post(`/course/assessment/submit`, answers, {
      params: { userId, assessmentId },
    });
    return res.data;
  } catch (err) {
    console.error("Submit assessment failed:", err);
    return null;
  }
};

export const unlockNextModuleIfAvailable = async (
  courseId,
  completedModuleId,
) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(
      `/modules/${completedModuleId}/unlock-next`,
      null,
      {
        params: {
          userId,
          courseId,
        },
      },
    );
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock next module failed:", err);
    return false;
  }
};

export const getVideosByModule = async (moduleId) => {
  try {
    const res = await api.get(`/modules/${moduleId}/videos`);
    return res.data || [];
  } catch (err) {
    console.error("Get videos by module failed:", err);
    return [];
  }
};

/* ==================== PROFILE ==================== */

export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile/me");
    return res.data?.user ?? null;
  } catch (err) {
    console.error("Profile fetch failed:", err);
    return null;
  }
};

/* ==================== PROFILE APIS ==================== */

// ✅ Profile photo upload
export const uploadProfilePhoto = async (file) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/auth/profile/upload-image', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Profile photo upload error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Upload failed'
    };
  }
};

// ✅ Get full user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.get('/auth/profile/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

// ✅ Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.put('/auth/profile/update', profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Update failed'
    };
  }
};

// ✅ Get current user (JWT)
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.get('/auth/jwt/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      message: 'Failed to get user data'
    };
  }
};

// ✅ Validate token
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { success: false, valid: false, message: 'No token found' };
    }

    const response = await api.post('/auth/jwt/validate', { token });
    return response.data;
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      success: false,
      valid: false,
      message: 'Token validation failed'
    };
  }
};



/* ==================== CHECKOUT ==================== */

export const checkoutCart = async (checkoutData) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("Please login first");

    const res = await api.post(`/cart/${userId}/checkout`, checkoutData);
    return res.data;
  } catch (err) {
    console.error("Checkout failed:", err);
    return null;
  }
};

/* ==================== STREAK ==================== */

export const getStreakOverview = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get("/profile/streak", {
      params: { userId },
    });

    return res.data;
  } catch (err) {
    console.error("Streak overview failed:", err);
    return null;
  }
};

export const getStreakDayDetails = async (courseId, date) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/streak/day/${courseId}`, {
      params: {
        userId,
        date,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Streak day details failed:", err);
    return null;
  }
};

export const getMonthStreak = async (courseId, year, month) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/streak/course/${courseId}/month`, {
      params: {
        userId,
        year,
        month,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Month streak fetch failed:", err);
    return null;
  }
};

export const searchCourses = async (query, userId = null) => {
  try {
    const params = {};
    if (query) params.search = query;
    if (userId) params.userId = userId;
    
    console.log('🔍 Search Request:', { query, userId, params });
    
    const response = await api.get('/courses', { params });
    
    console.log('🔍 Search Response:', {
      status: response.status,
      dataLength: response.data?.data?.length || 0,
      data: response.data
    });
    
    // Return empty array if no data
    return response.data?.data || [];
  } catch (error) {
    console.error('❌ Search Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Return empty array instead of throwing
    return [];
  }
};

// Advanced search function
export const advancedSearch = async (filters, userId = null) => {
  try {
    const params = { ...filters };
    if (userId) params.userId = userId;
    
    const response = await api.get('/courses/advanced-search', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Advanced Search Error:', error);
    throw error;
  }
};

// Get search suggestions
export const getSearchSuggestions = async (query) => {
  try {
    const response = await api.get('/courses/search/suggestions', {
      params: { query }
    });
    return response.data.suggestions || [];
  } catch (error) {
    console.error('❌ Search Suggestions Error:', error);
    return [];
  }
};

// Get courses by tag
export const getCoursesByTag = async (tagName, userId = null) => {
  try {
    const params = {};
    if (userId) params.userId = userId;
    
    const response = await api.get(`/courses/tag/${encodeURIComponent(tagName)}`, { params });
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Courses by Tag Error:', error);
    throw error;
  }
};

// Get popular tags
export const getPopularTags = async () => {
  try {
    const response = await api.get('/courses/tags/popular');
    return response.data.tags || [];
  } catch (error) {
    console.error('❌ Popular Tags Error:', error);
    return [];
  }
};

export const unlockVideoForUser = async (
  userId,
  courseId,
  moduleId,
  videoId,
) => {
  try {
    const res = await api.post(`/videos/${videoId}/unlock`, null, {
      params: {
        userId,
        courseId,
        moduleId,
      },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Unlock video failed:", err);
    return false;
  }
};

export const isModuleUnlocked = async (moduleId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.get(`/modules/${moduleId}/unlocked`, {
      params: { userId },
    });
    return res.data?.unlocked || false;
  } catch (err) {
    console.error("Check module unlock failed:", err);
    return false;
  }
};

export const getUserVideoProgress = async (videoId) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return null;

    const res = await api.get(`/videos/${videoId}/user-progress`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    console.error("Get user video progress failed:", err);
    return null;
  }
};

export const markVideoAsWatched = async (videoId, watchedSeconds) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) return false;

    const res = await api.post(`/videos/${videoId}/mark-watched`, null, {
      params: {
        userId,
        watchedSeconds,
      },
    });
    return res.data?.success || false;
  } catch (err) {
    console.error("Mark video as watched failed:", err);
    return false;
  }
};

export default {
  getCourses,
  getCourseById,
  getDashboardCourses,
  getCart,
  getCartSummary,
  addToCart,
  removeFromCart,
  clearCart,
  purchaseCourse,
  getPurchasedCourses,
  isCoursePurchased,
  getFavorites,
  addToFavorite,
  removeFromFavorites,
  getCourseProgress,
  getUserOverallProgress,
  getStreak,
  getDashboardStats,
  getModulesByCourse,
  getModuleById,
  unlockNextModule,
  unlockAssessment,
  updateVideoProgress,
  seekVideo,
  completeVideo,
  getAssessmentStatus,
  canAttemptAssessment,
  getAssessmentQuestions,
  submitAssessment,
  getModuleAssessments,
  getAssessmentDetails,
  checkModuleCompletion,
  checkAssessmentUnlock,
  submitAssessmentAnswer,
  unlockNextModuleIfAvailable,
  getVideosByModule,
  getProfile,
  checkoutCart,
  getStreakOverview,
  getStreakDayDetails,
  getMonthStreak,
  advancedSearch,
  getPopularTags,
  getCoursesByTag,
  getSearchSuggestions,
  unlockVideoForUser,
  isModuleUnlocked,
  getUserVideoProgress,
  markVideoAsWatched,
};