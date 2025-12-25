import { motion } from "framer-motion";

import { Star } from "lucide-react";


import { Link } from "react-router-dom";
import logo from "../assets/cdaxxlogo.png";
import CoursePlans from "../components/CoursePlans";
import HeroCarousel from "../components/HeroCarousel";
import LearningExperience from "../components/LearningExperience";
import CourseSection from "../components/CourseSection";
import TrustedBy from "../components/TrustedBy";
import CertificationSection from "../components/CertificationSection";
import JavaCareerCard from "../components/JavaCareerCard";
import BuildProject from "../components/BuildProject";
import WhyChooseUs from "../components/WhyChooseUs";


/* GLOBAL ANIMATION VARIANTS */

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeText = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scrollMorph = {
  hidden: { opacity: 0, y: 90, scale: 0.92, borderRadius: "60px" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    borderRadius: "16px",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const floatingImage = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

/*  COMPONENT  */
export default function HomeSections() {
  return (
    <div className="bg-[#eaf9ff] overflow-hidden font-body">
      <HeroCarousel/>
      <LearningExperience/>
      <BuildProject/>
      {/* <JavaCareerCard/> */}
      <CourseSection />
      <CoursePlans/>
      <CertificationSection/>
      {/*  SUCCESS STORIES  */}
      <section className="py-24  backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14 font-heading">
            Student Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-gray-50 p-6 rounded-2xl shadow"
                whileHover={{
                  rotateX: 4,
                  rotateY: -4,
                  scale: 1.05,
                }}
              >
                <p className="italic text-gray-700 mb-4">
                  "This platform changed my career completely."
                </p>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <WhyChooseUs/>
      <TrustedBy/>
    </div>
  );
}
