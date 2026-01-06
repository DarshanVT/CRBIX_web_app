import CoursePlans from "../components/CoursePlans";
import LearningExperience from "../components/LearningExperience";
import CourseSection from "../components/CourseSection";
import TrustedBy from "../components/TrustedBy";
import CertificationSection from "../components/CertificationSection";
import BuildProject from "../components/BuildProject";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/studentSuccess";
import DomeGallery from "../components/HeroCarousel";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/*  COMPONENT  */
export default function HomeSections() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#courses") {
      const el = document.getElementById("courses");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 40);
      }
    }
  }, [location]);
  return (
    <div className="bg-[#eaf9ff] overflow-hidden font-body">
         <div style={{ width: '100vw', height: '100vh' }}>
      <DomeGallery />
    </div>
      <LearningExperience />
      <CertificationSection />
      <div className="border-t border-gray-700 my-6"></div>
      <section id="courses">
        <CourseSection />
      </section>
      <div className="border-t border-gray-700 my-6"></div>
      <WhyChooseUs /> 
      <div className="border-t border-gray-700 my-6"></div>
      <CoursePlans />
      <div className="border-t border-gray-700 my-6"></div>
      <BuildProject />
      <div className="border-t border-gray-700 my-6"></div>
      <TrustedBy />
      <div className="border-t border-gray-700 my-6"></div>
     <Testimonials /> 
    </div>
  );
}