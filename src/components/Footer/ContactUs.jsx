import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube  } from "react-icons/fa";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#eaf9ff] dark:bg-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Have questions about courses, subscriptions, or your learning journey?
            We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* CONTACT INFO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-medium dark:text-gray-200">Email :</p>
                  <a
                    href="mailto:info.crbix@gmail.com?subject=Support%20Request"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    info.crbix@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-medium dark:text-gray-200">Phone</p>
                  <p>+91 8308818374</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-medium dark:text-gray-200">Address</p>
                  <p>
                    CDaX Learning Platform <br />
                    Pune, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Our support team usually responds within 24 hours.
            </p>
          </div>
          

          {/* CONTACT FORM */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Send Us a Message
            </h2>

            {submitted && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                Thank you for contacting us! We'll get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Bottom footer */}
                    <div className="px-6 md:px-20 py-6">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center space-x-4 mb-3">
                          <a href="https://www.facebook.com/" className="text-black dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition"><FaFacebook size={20} /></a>
                          <a href="https://x.com/" className="text-black dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition"><FaTwitter size={20} /></a>
                          <a href="https://www.instagram.com/" className="text-black dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition"><FaInstagram size={20} /></a>
                          <a href="https://in.linkedin.com/" className="text-black dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition"><FaLinkedin size={20} /></a>
                          <a href="https://www.youtube.com/" className="text-black dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition"><FaYoutube size={20} /></a>
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                          © {new Date().getFullYear()} CDaX. All rights reserved.
                        </span>
                      </div>
                    </div>
              

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;