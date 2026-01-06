import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Images
import start from "../assets/screens/start.PNG";
import login from "../assets/screens/login.PNG";
import dashbord from "../assets/screens/dashbord.PNG";
import course from "../assets/screens/courses.PNG";
import course1 from "../assets/screens/courseDetails.PNG";
import course2 from "../assets/screens/videos.PNG";

// Video
import videoStart from "../assets/screenVideo/Welcome.mp4";

export default function LearningExperience() {
  const videoRefs = useRef([]);
  const hoverTimeout = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const media = [
    { img: start, video: videoStart, direction: "up" },
    { img: login, video: videoStart, direction: "down" },
    { img: dashbord, video: videoStart, direction: "up" },
    { img: course, video: videoStart, direction: "down" },
    { img: course1, video: videoStart, direction: "up" },
    { img: course2, video: videoStart, direction: "down" },
  ];

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);

    hoverTimeout.current[index] = setTimeout(() => {
      // ❗ cursor abhi bhi isi card par hona chahiye
      if (hoveredIndex !== index) return;

      const video = videoRefs.current[index];
      if (video) {
        video.currentTime = 0;
        video.playbackRate = 2;
        video.play().catch(() => {});
      }
    }, 120); // intentional hover delay
  };

  const handleMouseLeave = (index) => {
    setHoveredIndex(null);

    // ❗ pending hover timeout clear
    if (hoverTimeout.current[index]) {
      clearTimeout(hoverTimeout.current[index]);
      hoverTimeout.current[index] = null;
    }

    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section className="mt-1">
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: false }}
        className="mt-20 max-w-3xl mx-auto text-center px-6"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-6">
          Best Learning Experience
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Learn with structured courses, real-world projects, progress tracking,
          and daily streaks — designed to keep you consistent and job-ready.
        </p>
      </motion.div>

      {/* MEDIA GRID */}
      <div className="py-20 flex flex-wrap justify-center gap-10">
        {media.map((item, index) => (
          <motion.div
            key={index}
            className="relative w-36 md:w-44 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            initial={{
              opacity: 0,
              y: item.direction === "up" ? 100 : -100,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -12,
              scale: 1.06,
              boxShadow: "0px 20px 40px rgba(59,130,246,0.35)",
            }}
            transition={{ duration: 1, delay: index * 0.15 }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* IMAGE */}
            <motion.img
              src={item.img}
              alt="preview"
              className={`w-full h-auto block transition-opacity duration-300 ${
                hoveredIndex === index ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* VIDEO */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video}
              muted
              playsInline
              loop
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                hoveredIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{ pointerEvents: "none" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
