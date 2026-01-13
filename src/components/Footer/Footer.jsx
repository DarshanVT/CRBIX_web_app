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

const Footer = () => {
  return (
   
    <footer className="bg-[#d2f1ff] dark:bg-gray-900 text-black dark:text-gray-200 text-sm">
       <div className="border-t border-gray-300 dark:border-gray-700"></div>
      {/* Main footer content */}
      <div className="px-6 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-28">
        {/* Column 1 - Company Info & App Stores */}
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

        {/* Columns 2 & 3 - Right section (2/3 width) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side (About & Legal) */}
          <div className="grid grid-cols-1 gap-6">
            {/* About */}
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">About</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400" >
                <li><Link to="/about-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blogs</Link></li>
                <li><Link to="/investors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Investors</Link></li>
              </ul>
            </div>

            {/* Legal Accessibility */}
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">Legal Accessibility</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400" >
                <li><Link to="Accessibility" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility Statement</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Right side (Discover & Skills) */}
          <div className="grid grid-cols-1 gap-6">
            {/* Discover CDaX */}
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">Discover CDaX</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li><Link to="/tech-on-cdax" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tech on CDaX</Link></li>
                <li><Link to="/plans-pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plans & Pricing</Link></li>
                <li><Link to="/help-support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help & Support</Link></li>
              </ul>
            </div>

            {/* Top Skills & Certifications */}
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-4 text-lg">Explore top Skills and Certifications</h4>
              <ul className="space-y-2 grid grid-cols-2 md:grid-cols-1 gap-x-6 text-gray-600 dark:text-gray-400">
                <li><Link to="/skills/android" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Android Development</Link></li>
                <li><Link to="/skills/web" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Web Development</Link></li>
                <li><Link to="/skills/java" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Java Development</Link></li>
                <li><Link to="/skills/python" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Python Development</Link></li>
                <li><Link to="/skills/dotnet" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">.NET Development</Link></li>
                <li><Link to="/skills/uiux" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">UI/UX Development</Link></li>
                <li><Link to="/skills/aiml" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI / ML</Link></li>
                <li><Link to="/skills/data" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Data Analytics</Link></li>
                <li><Link to="/skills/testing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Software Testing</Link></li>
                <li><Link to="/skills/networking" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Networking</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

      {/* Bottom footer */}
      <div className="px-6 md:px-20 py-6 ">
        <div className="flex flex-col items-center justify-center text-center ">
          <div className="flex items-center space-x-4 mb-3 ">
            <a href="https://www.facebook.com/" className="text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><FaFacebook size={20} /></a>
            <a href="https://x.com/" className="text-black dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 transition-colors"><FaTwitter size={20} /></a>
            <a href="https://www.instagram.com/" className="text-black dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"><FaInstagram size={20} /></a>
            <a href="https://in.linkedin.com/" className="text-black dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"><FaLinkedin size={20} /></a>
            <a href="https://www.youtube.com/" className="text-black dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"><FaYoutube size={20} /></a>
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