import { useRoute } from "wouter";
import { Star } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Hero from "../../assets/Hero.png";
import { useEffect, useState } from "react";
 
const COURSE_DATA: any = {
  1: {
    title: "Flutter Development Course",
    subtitle: "Build cross-platform apps using Flutter & Dart",
    duration: "3 Months • Live",
    price: "₹299",
    image: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=500&q=80",
  },
  2: {
    title: "The Complete 2026 Web Development",
    subtitle: "HTML, CSS, JS, React, Node and Full Stack Projects",
    duration: "6 Months • Self-paced",
    price: "₹299",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80",
  },
  3: {
    title: "Machine Learning A-Z™: AI, Python & R",
    subtitle: "Learn ML, Deep Learning and practical AI",
    duration: "5 Months • Live",
    price: "₹299",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&q=80",
  },
  4: {
    title: "React - The Complete Guide 2024",
    subtitle: "Become a Pro React Developer",
    duration: "4 Months • Self-paced",
    price: "₹299",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80",
  },
};
 
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
 
function HeroCarousel({ course }: { course: any }) {
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
 
  const slides = [
    Hero,  
    "https://www.rushu.rush.edu/sites/default/files/legacy/images/news-articles/online-class-note-taking-news.jpg ",
    "https://img.freepik.com/free-photo/books-laptop-assortment_23-2149765831.jpg?semt=ais_se_enriched&w=740&q=80 "
  ];
 
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];
  const slideWidth = 100;
 
  useEffect(() => {
    setTranslateX(-slideWidth);
  }, []);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setTranslateX(prev => prev - slideWidth);
    }, 3750);
 
    return () => clearInterval(interval);
  }, []);
 
  const handleTransitionEnd = () => {
    if (translateX <= -slideWidth * (slides.length + 1)) {
      setIsTransitioning(false);
      setTranslateX(-slideWidth);
    } else if (translateX >= 0) {
      setIsTransitioning(false);
      setTranslateX(-slideWidth * slides.length);
    }
  };
 
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);
 
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(${translateX}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
     
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => {
          const currentIndex = Math.abs(Math.round(translateX / slideWidth) + 1) % slides.length;
          const isActive = currentIndex === index;
          return (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          );
        })}
      </div>
    </div>
  );
}
 
export default function CourseDetails() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  const [match, params] = useRoute("/course/:id");
  const id = params?.id;
 
  const course = COURSE_DATA[id || ""];
 
  if (!course)
    return (
      <div className="p-10 text-center text-xl font-bold">Course Not Found</div>
    );
 
  return (
    <div className="min-h-screen bg-[#f7f7fb] text-brand-text">
      <Navbar />
 
      <section className="max-w-[1200px] mx-auto mt-5 bg-white rounded-2xl shadow-lg overflow-hidden">
 
        {/* Responsive Hero Carousel */}
        <div className="w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] relative overflow-hidden">
          <HeroCarousel course={course} />
        </div>
 
        <div className="p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
 
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {course.title}
            </h1>
 
            <p className="text-gray-600 text-base sm:text-lg mb-5">
              {course.subtitle}
            </p>
 
            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Course Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Learn with expert mentors and hands-on projects. Get industry-level skills
                and job-ready experience with real world assignments.
              </p>
            </div>
 
            {/* Reviews */}
            <div className="mt-10">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Student Reviews
              </h3>
 
              <div className="flex gap-5 overflow-x-auto pb-3 snap-x">
                {REVIEWS.map((rev, i) => (
                  <div
                    key={i}
                    className="min-w-[250px] sm:min-w-[300px] snap-start bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-100 shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={rev.img} alt="rev img" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{rev.name}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">{rev.role}</p>
                      </div>
                    </div>
 
                    <div className="flex text-yellow-500 mb-2">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} size={16} fill="currentColor" />
                      ))}
                    </div>
 
                    <p className="text-gray-700 text-sm">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* RIGHT CARD */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-fit sticky top-24">
            <div className="h-44 sm:h-56 overflow-hidden rounded-lg">
              <img src={course.image} alt="course img" className="w-full h-full object-cover" />
            </div>
 
            <button className="mt-4 w-full py-3 bg-brand-dark text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-brand-medium transition">
              Enroll Now
            </button>
 
            <div className="mt-4">
              <h3 className="font-semibold mb-3 text-base sm:text-lg">
                This Course Includes
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Lifetime access</li>
                <li>• Certificate of Completion</li>
                <li>• Downloadable Resources</li>
                <li>• Access on Mobile & Web</li>
              </ul>
            </div>
          </div>
 
        </div>
      </section>
    </div>
  );
}
 
 