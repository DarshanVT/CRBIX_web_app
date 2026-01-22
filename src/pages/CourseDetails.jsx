import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Star, Users, Clock, Award, Check } from "lucide-react";
import { useCart } from "../components/Navbar/CartContext";
import { useAuth } from "../components/Login/AuthContext";
import { useTheme } from "../components/Profile/ThemeContext";
import CourseContent from "../components/Courses/CourseContent";

const REVIEWS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    rating: 5,
    comment: "Amazing course! The explanations were clear and super helpful.",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Raj Patel",
    role: "Frontend Developer",
    rating: 4,
    comment: "Very informative and practical with real-world projects.",
    img: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Aisha Khan",
    role: "Data Scientist",
    rating: 5,
    comment: "Hands-on assignments boosted my confidence a lot!",
    img: "https://i.pravatar.cc/150?img=47",
  },
];

/* ------------------ Hero Carousel ------------------ */
function HeroCarousel({ slides, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % slides.length);
    }, 4000);

    return () => clearInterval(id);
  }, [slides.length, isPaused]);

  return (
    <div
      className="relative w-full h-[250px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-t-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <img
        src={slides[currentIndex]}
        alt="course hero"
        className="w-full h-full object-cover transition-all duration-700"
      />
      
      {/* Overlay gradient based on theme */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        theme === 'dark' 
          ? 'from-gray-900/70 via-gray-900/20 to-transparent' 
          : 'from-black/40 via-transparent to-transparent'
      }`}></div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Course mapping for fallback (when backend fails)
const COURSE_MAPPING = {
  '1': {
    title: 'Complete Java Programming',
    author: 'Dr. Naseer peerzade ',
    price: 399,
    originalPrice: 1999,
    rating: 4.7,
    reviews: '1,250',
    category: 'Programming',
    level: 'Beginner',
    tags: ['Java', 'Programming', 'Backend'],
    description: 'Master Java programming from basics to advanced concepts including OOP, Collections, Multithreading, and more.',
  },
  '2': {
    title: 'Python Programming Mastery',
    author: 'Prof. Raksha Ghare',
    price: 299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: '890',
    category: 'Programming',
    level: 'Beginner',
    tags: ['Python', 'Data Science', 'AI'],
    description: 'Learn Python programming for data science, machine learning, web development and automation.',
  },
  '3': {
    title: 'Flutter Mobile Development',
    author: 'Dr. Naseer peerzade',
    price: 499,
    originalPrice: 2499,
    rating: 4.6,
    reviews: '1,100',
    category: 'Mobile Development',
    level: 'Intermediate',
    tags: ['Flutter', 'Mobile', 'Dart'],
    description: 'Build beautiful native mobile apps for iOS and Android using Flutter and Dart.',
  },
  '4': {
    title: 'C/C++ Programming Course',
    author: 'Prof. Raksha Ghare',
    price: 499,
    originalPrice: 4999,
    rating: 4.5,
    reviews: '720',
    category: 'Programming',
    level: 'Intermediate',
    tags: ['C', 'C++', 'System Programming'],
    description: 'Master C and C++ programming for system development, game programming, and high-performance applications.',
  },
  '5': {
    title: 'C# .NET Development',
    author: 'Dr. Naseer peerzade',
    price: 1699,
    originalPrice: 2299,
    rating: 4.4,
    reviews: '650',
    category: 'Programming',
    level: 'Intermediate',
    tags: ['C#', '.NET', 'ASP.NET'],
    description: 'Learn C# and .NET framework for building enterprise applications, web APIs, and desktop applications.',
  },
  '6': {
    title: 'Data Structures & Algorithms',
    author: 'Dr. Naseer peerzade',
    price: 2599,
    originalPrice: 3499,
    rating: 4.9,
    reviews: '950',
    category: 'Computer Science',
    level: 'Advanced',
    tags: ['DSA', 'Algorithms', 'Interview Prep'],
    description: 'Master data structures and algorithms for coding interviews and competitive programming.',
  },
  '7': {
    title: 'React Web Development',
    author: 'Dr. Naseer peerzade',
    price: 2099,
    originalPrice: 2799,
    rating: 4.7,
    reviews: '880',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['React', 'JavaScript', 'Frontend'],
    description: 'Build modern web applications with React, Redux, React Router, and other essential frontend technologies.',
  },
};

// Get course details based on ID
const getCourseDetailsById = (courseId) => {
  return COURSE_MAPPING[courseId] || {
    title: `Course ${courseId}`,
    author: 'Dr. Naseer peerzade',
    price: 999,
    originalPrice: 1999,
    rating: 4.5,
    reviews: '100+',
    category: 'Programming',
    level: 'Beginner',
    tags: ['Programming'],
    description: 'Learn programming skills with this comprehensive course.',
  };
};

/* ------------------ Course Details Page ------------------ */
export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openLogin } = useAuth();
  const { addToCart, cart } = useCart();
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [startLearning, setStartLearning] = useState(false);

  const alreadyInCart = cart.some((c) => c.id === course?.id);

  useEffect(() => {
    console.log("Course state updated:", {
      courseId: course?.id,
      courseTitle: course?.title,
      requestedId: id,
      modulesCount: course?.modules?.length,
      loading: loading
    });
  }, [course, loading, id]);

  const loadCourse = useCallback(async () => {
    setLoading(true);
    try {
      console.log(" START: Loading course for ID:", id);
      
      const userId = user?.id || localStorage.getItem("user_id");
      console.log(" User ID:", userId);
      
      // Try to fetch from backend first
      const token = localStorage.getItem("auth_token");
      const url = `https://cdaxx-backend.onrender.com/api/courses/${id}${userId ? `?userId=${userId}` : ''}`;
      
      console.log(" Fetching from backend:", url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const apiData = await response.json();
        console.log(" Backend response received");

        const actualCourse = apiData.data || apiData;
        
        if (actualCourse && actualCourse.id) {
          console.log(" Course data from backend:", actualCourse.title);

          const formattedCourse = {
            id: actualCourse.id,
            title: actualCourse.title,
            description: actualCourse.description,
            thumbnailUrl: actualCourse.thumbnailUrl,
            instructor: actualCourse.instructor,
            isPurchased: Boolean(actualCourse.isPurchased),
            purchased: Boolean(actualCourse.isPurchased),
            
            modules: Array.isArray(actualCourse.modules) 
              ? actualCourse.modules.map((module, index) => ({
                  id: module.id || `module-${index}`,
                  title: module.title || `Module ${index + 1}`,
                  durationSec: module.durationSec || 0,
                  isLocked: module.isLocked !== undefined ? module.isLocked : (index > 0),
                  assessmentLocked: module.assessmentLocked !== undefined ? module.assessmentLocked : true,
                  
                  videos: Array.isArray(module.videos) 
                    ? module.videos.map((video, videoIndex) => ({
                        id: video.id || `video-${index}-${videoIndex}`,
                        title: video.title || `Video ${videoIndex + 1}`,
                        duration: video.duration || video.durationSec || 0,
                        isLocked: video.isLocked !== undefined ? video.isLocked : (videoIndex > 0),
                        isCompleted: video.isCompleted || false,
                        displayOrder: video.displayOrder || videoIndex,
                        isPreview: video.isPreview || false,
                        videoUrl: video.videoUrl || '',
                        youtubeId: video.youtubeId || ''
                      }))
                    : []
                }))
              : [],
            
            price: actualCourse.price || 0,
            originalPrice: actualCourse.originalPrice || 0,
            image: actualCourse.thumbnailUrl?.startsWith("http")
              ? actualCourse.thumbnailUrl
              : actualCourse.thumbnailUrl
                ? `http://localhost:8080/${actualCourse.thumbnailUrl}`
                : theme === 'dark' 
                  ? "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            author: actualCourse.instructor || "Instructor",
            rating: actualCourse.rating || 4.5,
            reviews: actualCourse.reviewCount || "100+",
            category: actualCourse.category,
            level: actualCourse.level,
            tags: actualCourse.tags || []
          };
          
          setCourse(formattedCourse);
          setLoading(false);
          return;
        }
      }
      
      // If backend fetch fails, use local mapping
      console.log(" Backend fetch failed, using local course data for ID:", id);
      
      const courseDetails = getCourseDetailsById(id);
      
      const localCourse = {
        id: parseInt(id) || 1,
        title: courseDetails.title,
        description: courseDetails.description,
        instructor: courseDetails.author,
        isPurchased: false,
        purchased: false,
        
        modules: [
          {
            id: 1,
            title: "Module 1: Introduction",
            isLocked: false,
            assessmentLocked: true,
            videos: [
              {
                id: 1,
                title: `Welcome to ${courseDetails.title}`,
                duration: 600,
                isLocked: false,
                isCompleted: false,
                displayOrder: 1,
                isPreview: true,
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                youtubeId: null
              },
              {
                id: 2,
                title: "Getting Started",
                duration: 720,
                isLocked: true,
                isCompleted: false,
                displayOrder: 2,
                isPreview: false,
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                youtubeId: null
              }
            ]
          },
          {
            id: 2,
            title: "Module 2: Core Concepts",
            isLocked: true,
            assessmentLocked: true,
            videos: [
              {
                id: 3,
                title: "Advanced Topics",
                duration: 780,
                isLocked: true,
                isCompleted: false,
                displayOrder: 1,
                isPreview: true,
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                youtubeId: null
              }
            ]
          }
        ],
        
        price: courseDetails.price,
        originalPrice: courseDetails.originalPrice,
        image: theme === 'dark' 
          ? "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        author: courseDetails.author,
        rating: courseDetails.rating,
        reviews: courseDetails.reviews,
        category: courseDetails.category,
        level: courseDetails.level,
        tags: courseDetails.tags
      };
      
      console.log(" Local course created:", localCourse.title);
      setCourse(localCourse);
      
    } catch (err) {
      console.error(" ERROR loading course:", err);
    
      const courseDetails = getCourseDetailsById(id);
      
      console.log(" Creating fallback course for:", courseDetails.title);
      
      const minimalCourse = {
        id: parseInt(id) || 1,
        title: courseDetails.title,
        description: courseDetails.description,
        isPurchased: false,
        purchased: false,
        modules: [
          {
            id: 1,
            title: "Module 1: Introduction",
            isLocked: false,
            assessmentLocked: true,
            videos: [
              {
                id: 1,
                title: `Introduction to ${courseDetails.title}`,
                duration: 720,
                isLocked: false,
                isCompleted: false,
                displayOrder: 1,
                isPreview: true,
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                youtubeId: null
              }
            ]
          }
        ],
        price: courseDetails.price,
        originalPrice: courseDetails.originalPrice,
        image: theme === 'dark' 
          ? "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        author: courseDetails.author,
        rating: courseDetails.rating,
        reviews: courseDetails.reviews,
        category: courseDetails.category,
        level: courseDetails.level,
        tags: courseDetails.tags
      };
      
      setCourse(minimalCourse);
    } finally {
      console.log(" FINISHED: Setting loading to false");
      setLoading(false);
    }
  }, [id, user?.id, theme]);

  useEffect(() => {
    console.log(" CourseDetails mounted for course ID:", id);
    window.scrollTo(0, 0);
    
    setCourse(null);
    setLoading(true);
    
    loadCourse();
  }, [id, loadCourse]);

  const handleMainAction = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (course?.purchased) {
      setStartLearning((prev) => !prev);
      return;
    }

    if (!alreadyInCart && course) {
      addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
      });

      setPopupMessage("Course added to cart");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/cart");
      }, 800);
    } else {
      navigate("/cart");
    }
  };

  const calculateTotalDuration = () => {
    if (!Array.isArray(course?.modules) || course.modules.length === 0) {
      return "0m";
    }

    let totalSeconds = 0;
    course.modules.forEach((m) =>
      m.videos?.forEach((v) => (totalSeconds += v.duration || 0))
    );

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);

    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Hero slides based on theme
  const heroSlides = theme === 'dark' ? [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1456513080510-3444ffa6b6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ] : [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "https://www.rushu.rush.edu/sites/default/files/legacy/images/news-articles/online-class-note-taking-news.jpg",
    "https://img.freepik.com/free-photo/books-laptop-assortment_23-2149765831.jpg",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-400 mb-4">Course not found</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-[#eaf9ff]'
    } text-gray-900 dark:text-white pt-10 pb-10 relative transition-colors duration-300`}>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-5 right-5 bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <Check size={20} />
          <span className="font-semibold">{popupMessage}</span>
        </div>
      )}

      <section className={`max-w-[1200px] mx-auto pt-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
        {/* HERO */}
        <HeroCarousel slides={heroSlides} theme={theme} />

        {/* Course Content */}
        <div className="p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {course.category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                )}
                {course.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4">
                by {course.author}
              </p>

              <div className="flex items-center gap-2 text-yellow-500 mb-4">
                {Array.from({ length: Math.round(course.rating) }).map(
                  (_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  )
                )}
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                  {course.rating} ({course.reviews} reviews)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-gray-500 dark:text-gray-500" />
                  <span>{calculateTotalDuration()} total length</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-gray-500 dark:text-gray-500" />
                  <span>{course.reviews} students enrolled</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Course Overview
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {course.description}
              </p>
            </div>

            {/* Student Reviews */}
            <div className="mt-10">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Student Reviews
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {REVIEWS.map((rev, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100 shadow'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={rev.img}
                        alt={rev.name}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{rev.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{rev.role}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500 mb-3">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content Component */}
            <div className="mt-10">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Course Content
              </h3>
              
              {/* Debug Info */}
              <div className={`mb-6 p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-green-900/20 border-green-800/30' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-800'
                  }`}>Course Loaded: {course.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>Course ID:</div>
                  <div className="font-medium text-gray-900 dark:text-white">{course.id}</div>
                  
                  <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>Instructor:</div>
                  <div className="font-medium text-gray-900 dark:text-white">{course.author}</div>
                  
                  <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>Price:</div>
                  <div className="font-medium text-gray-900 dark:text-white">₹{course.price}</div>
                  
                  <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>Purchased:</div>
                  <div className="font-medium text-gray-900 dark:text-white">{course.purchased ? "✅ Yes" : "❌ No"}</div>
                </div>
              </div>
              
              {/* CourseContent Component */}
              {course && course.modules && course.modules.length > 0 ? (
                <CourseContent
                  course={course}
                  startLearning={startLearning}
                  setStartLearning={setStartLearning}
                />
              ) : (
                <div className={`text-center py-10 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Course content will be available soon</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Modules and videos are being prepared for this course
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className={`border rounded-xl shadow-lg h-fit sticky top-32 overflow-hidden ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="h-48 overflow-hidden relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) =>
                  (e.target.src = theme === 'dark'
                    ? "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800"
                    : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800")
                }
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                theme === 'dark' 
                  ? 'from-gray-900/80 to-transparent' 
                  : 'from-black/30 to-transparent'
              }`}></div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xl font-bold mb-4">
                <span className="text-gray-900 dark:text-white">₹{course.price}</span>
                {course.originalPrice &&
                  course.originalPrice > course.price && (
                    <span className="line-through text-gray-400 dark:text-gray-500">
                      ₹{course.originalPrice}
                    </span>
                  )}
              </div>

              <div className="space-y-4 mb-6">
                <button
                  onClick={handleMainAction}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {course.purchased
                    ? "Start Learning"
                    : alreadyInCart
                    ? "Go to Cart"
                    : "Enroll Now"}
                </button>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Award size={20} className="text-blue-500 dark:text-blue-400" />
                  This Course Includes
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Check size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Assessments & Quizzes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Check size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Check size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Downloadable Resources</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Check size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Access on Mobile & Web</span>
                  </li>
                </ul>
              </div>

              {/* Course Info */}
              <div className="mt-6 border-t dark:border-gray-700 pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {calculateTotalDuration()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-500">Modules:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.modules?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-500">Level:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.level || "All Levels"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray500">Last Updated:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Recently</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}