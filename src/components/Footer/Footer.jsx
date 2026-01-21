import { Link } from "react-router-dom";
import { 
  FaApple, 
  FaGooglePlay, 
  FaPhoneAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube   
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCourses } from "../../Api/course.api"; 

const Footer = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        console.log("Footer courses loaded:", data); 
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load courses for footer", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <footer className="bg-[#d2f1ff] dark:bg-gray-900 text-black dark:text-gray-200 text-sm">
      <div className="border-t border-gray-300 dark:border-gray-700"></div>
      
      <div className="px-6 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-28">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">CDaX App</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            CDaX is democratising education, making it accessible to all. Join the revolution, learn on India's largest learning platform.
          </p>

          <div className="mb-6">
            <h4 className="font-semibold text-black dark:text-white mb-3">App Store</h4>
            <div className="flex flex-col space-y-3">
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-black dark:bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition w-48"
              >
                <FaApple className="mr-2 text-xl" />
                <div className="text-left">
                  <div className="font-semibold">Apple Store</div>
                </div>
              </a>
              <a 
                href="https://play.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-black dark:bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition w-48"
              >
                <FaGooglePlay className="mr-2 text-xl" />
                <div className="text-left">
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-black dark:text-white mb-3">Reach out to us</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Get your questions answered about learning with CDaX.
            </p>
            <div className="flex items-center mt-2 text-gray-800 dark:text-gray-300">
              <FaPhoneAlt className="mr-2" />
              <span className="font-medium">Call +91 8308818374</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">About</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><Link to="/about-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blogs</Link></li>
                <li><Link to="/investors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Investors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">Legal Accessibility</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/accessibility" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility Statement</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">

            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">Discover CDaX</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><Link to="/tech-on-cdax" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tech on CDaX</Link></li>
                <li><Link to="/plans-pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plans & Pricing</Link></li>
                <li><Link to="/help-support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help & Support</Link></li>
              </ul>
            </div>


            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">
                Popular Courses
              </h4>
              
              {loading ? (
                <div className="text-gray-500 dark:text-gray-400">
                  Loading courses...
                </div>
              ) : error ? (
                <div className="text-red-500 dark:text-red-400">
                  {error}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">
                  No courses available
                </div>
              ) : (
                <ul className="space-y-2 grid grid-cols-1 gap-x-6 text-gray-600 dark:text-gray-400">
                  {courses.slice(0, 10).map((course) => (
                    <li key={course.id || course._id} className="truncate">
                      <Link 
                        to={`/course/${course.id || course._id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate"
                        title={course.title} 
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))}
                  
                  {courses.length > 10 && (
                    <li className="mt-2">
                      <Link 
                        to="/courses"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        View All {courses.length} Courses →
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

      {/* Bottom footer */}
      <div className="px-6 md:px-20 py-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-4 mb-3">
            <a href="https://www.facebook.com/" className="text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="https://x.com/" className="text-black dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://www.instagram.com/" className="text-black dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://in.linkedin.com/" className="text-black dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="https://www.youtube.com/" className="text-black dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <FaYoutube size={20} />
            </a>
          </div>
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            © {new Date().getFullYear()} CDaX. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;