import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import DomeGallery from "../components/Dashbord/HeroCarousel";
import LearningExperience from "../components/Dashbord/LearningExperience";
import CourseGridSection from "../components/Courses/CourseSection";
import WhyChooseUs from "../components/Dashbord/WhyChooseUs";
import CoursePlans from "../components/Courses/CoursePlans";
import BuildProject from "../components/Dashbord/BuildProject";
import TrustedBy from "../components/Dashbord/TrustedBy";
import Testimonials from "../components/Dashbord/studentSuccess";
import GetCertified from "../components/Dashbord/CertificationSection";
import WhatsAppButton from "../whatsapp/WhatsAppButton";

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
    <div className="bg-[#eaf9ff] dark:bg-gray-900 overflow-hidden font-body transition-colors duration-200">
         <div style={{ width: '100vw', height: '100vh' }}>
      <DomeGallery />
    </div>
      <LearningExperience />
        <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <GetCertified />
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <section id="courses">
        <CourseGridSection />
      </section>
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <WhyChooseUs /> 
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <CoursePlans />
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <BuildProject />
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
      <TrustedBy />
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
     <Testimonials /> 
     <WhatsAppButton />
    </div>
  );
}