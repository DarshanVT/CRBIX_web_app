import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero1 from "../../assets/hero/2.jpg";
import hero2 from "../../assets/hero/5.jpg";
import hero3 from "../../assets/hero/7.jpg";

const slides = [
  {
    title: "Build Job-Ready Skills for the Future",
    desc: "Build real-world, job-ready skills with industry-focused courses designed for 2026 and beyond. Learn through hands-on projects, expert mentorship, and practical assignments that prepare you for real company requirements.",
    image: hero1,
    color: "from-blue-500/10 to-cyan-500/10",
    icon: "🎯",
  },
  {
    title: "Learn With Real Industry Projects",
    desc: "Work on real-world industry projects designed by professionals. Gain practical experience, build a strong portfolio, and develop problem-solving skills that employers actually look for.",
    image: hero2,
    color: "from-purple-500/10 to-pink-500/10",
    icon: "🚀",
  },
  {
    title: "Upgrade Your Career Faster",
    desc: "Upgrade your career with future-ready skills through structured learning paths, expert guidance, and real-world projects. Stay ahead in the job market with skills that matter in 2026 and beyond.",
    image: hero3,
    color: "from-orange-500/10 to-red-500/10",
    icon: "⚡",
  },
];

export default function BuildProject() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const textVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    exit: { scale: 0, rotate: 180 },
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT - Fixed version */}
          <div className="min-h-[400px] md:min-h-[450px] flex items-center relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="w-full"
              >
                {/* Title with Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    key={slides[current].icon}
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-3xl"
                  >
                    {slides[current].icon}
                  </motion.div>
                  <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {slides[current].title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-gray-600 mb-6 text-lg"
                >
                  {slides[current].desc}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex flex-wrap gap-4 mb-8"
                >
                  <button
                    onClick={() => {
                      document.getElementById("courses")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                  >
                    Explore Courses
                  </button>
                  <Link to="/contact-us">
                    <button className="border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition transform hover:scale-105 active:scale-95">
                      Talk to Expert
                    </button>
                  </Link>
                </motion.div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700"
                >
                  {[
                    "Industry-designed curriculum",
                    "Hands-on real projects",
                    "Job-focused learning paths",
                    "Career mentorship support",
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: index * 0.5,
                        }}
                        className="text-green-500"
                      >
                        ✓
                      </motion.span>
                      <span className="text-sm md:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-4xl shadow-xl hover:shadow-2xl transition-shadow duration-500 min-h-[300px] md:min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full"
                >
                  <img
                    src={slides[current].image}
                    alt="hero"
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  {/* Dynamic gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                    rounded-2xl pointer-events-none`}
                  />

                  {/* Slide indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {slides.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > current ? 1 : -1);
                          setCurrent(idx);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          idx === current
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 backdrop-blur-sm bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 backdrop-blur-sm bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
