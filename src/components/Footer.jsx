import React from "react";
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
   
    <footer className="bg-[#d2f1ff]  text-black text-sm">
       <div className="border-t border-gray-700 "></div>
      {/* Main footer content */}
      <div className="px-6 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-28">
        {/* Column 1 - Company Info & App Stores */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-black mb-4">CDaX App</h3>
          <p className="mb-6 text-gray-400">
            CDaX is democratising education, making it accessible to all. Join the revolution, learn on India's largest learning platform.
          </p>

          <div className="mb-6">
            <h4 className="font-semibold text-black mb-3">App Store</h4>
            <div className="flex flex-col space-y-3">
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-black text-white  px-4 py-2 rounded-lg hover:bg-gray-800 transition w-48"
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
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-48"
              >
                <FaGooglePlay className="mr-2 text-xl" />
                <div className="text-left">
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-black mb-3">Reach out to us</h4>
            <p className="text-black mb-3">
              Get your questions answered about learning with CDaX.
            </p>
            <div className="flex items-center mt-2">
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
              <h4 className="font-semibold text-black mb-4 text-lg">About</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li> 
                <li><a href="#" className="hover:text-white transition">Blogs</a></li>
                <li><a href="#" className="hover:text-white transition">Investors</a></li>
              </ul>
            </div>

            {/* Legal Accessibility */}
            <div>
              <h4 className="font-semibold text-black mb-4 text-lg">Legal Accessibility</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Accessibility Statement</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>

          {/* Right side (Discover & Skills) */}
          <div className="grid grid-cols-1 gap-6">
            {/* Discover CDaX */}
            <div>
              <h4 className="font-semibold text-black mb-4 text-lg">Discover CDaX</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition">Tech on Cdax</a></li>
                <li><a href="#" className="hover:text-white transition">Plans and Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Help and Support</a></li>
              </ul>
            </div>

            {/* Top Skills & Certifications */}
            <div>
              <h4 className="font-semibold text-black mb-4 text-lg">Explore top Skills and Certifications</h4>
              <ul className="space-y-2 grid grid-cols-2 md:grid-cols-1 gap-x-6">
                <li><a href="#" className="hover:text-white transition">Android Development</a></li>
                <li><a href="#" className="hover:text-white transition">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition">Java Development</a></li>
                <li><a href="#" className="hover:text-white transition">Python Development</a></li>
                <li><a href="#" className="hover:text-white transition">.Net Development</a></li>
                <li><a href="#" className="hover:text-white transition">UI/UX Development</a></li>
                <li><a href="#" className="hover:text-white transition">AI/ML</a></li>
                <li><a href="#" className="hover:text-white transition">Data Analytics</a></li>
                <li><a href="#" className="hover:text-white transition">Software Testing</a></li>
                <li><a href="#" className="hover:text-white transition">Computer Networking</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Bottom footer */}
      <div className="px-6 md:px-20 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-4 mb-3">
            <a href="#" className="text-gray-900 hover:text-white transition"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-900 hover:text-white transition"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-900 hover:text-white transition"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-900 hover:text-white transition"><FaLinkedin size={20} /></a>
            <a href="#" className="text-gray-900 hover:text-white transition"><FaYoutube size={20} /></a>
          </div>
          <span className="text-gray-900 text-xs">
            © {new Date().getFullYear()} CDaX. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="text-gray-900 hover:text-white transition text-xs">Terms and conditions</a>
          <a href="#" className="text-gray-900 hover:text-white transition text-xs">Privacy policy</a>
          <a href="#" className="text-gray-900 hover:text-white transition text-xs">Sitemap</a>
          <a href="#" className="text-gray-900 hover:text-white transition text-xs">Refund Policy</a>
          <a href="#" className="text-gray-900 hover:text-white transition text-xs">Takedown Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
