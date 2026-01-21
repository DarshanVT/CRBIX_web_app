import React from "react";
import { Link } from "react-router-dom";

export default function Investors() {
  return (
    <section className="w-full mx-auto px-4 pt-5 pb-5 dark:bg-gray-900">
      {/* HERO */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Invest in CDaX</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
          CDaX is building a next-generation learning platform focused on
          industry-ready skills, practical training, and career outcomes.
        </p>
      </div>

      {/* WHY CDAX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-800/50 transition">
          <h3 className="text-xl font-bold mb-3 dark:text-white">🚀 Rapid Growth</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Strong demand for job-ready tech skills in India and global markets
            is driving fast user adoption.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-800/50 transition">
          <h3 className="text-xl font-bold mb-3 dark:text-white">🎓 Industry-Focused Learning</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Courses designed by professionals to bridge the gap between
            academics and real-world requirements.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-800/50 transition">
          <h3 className="text-xl font-bold mb-3 dark:text-white">📈 Scalable Platform</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Built on modern, scalable technologies that support rapid expansion
            across multiple learning domains.
          </p>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-10 mb-20">
        <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">
          Platform Highlights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Active Learners</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">50+</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Skill-Focused Courses</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">95%</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Learner Satisfaction</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">24×7</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Platform Availability</p>
          </div>
        </div>
      </div>

      {/* VISION */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Vision</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          To become a globally trusted platform for practical technology
          education, empowering learners to build meaningful careers and
          enabling organizations to access skilled talent.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Partner With Us in Shaping the Future of Education
        </h2>
        <p className="mb-6 max-w-2xl mx-auto text-purple-100">
          We welcome strategic investors and partners who share our vision of
          transforming skill-based education.
        </p>
        <Link
          to="/contact-us"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Contact Investor Relations
        </Link>
      </div>
    </section>
  );
}