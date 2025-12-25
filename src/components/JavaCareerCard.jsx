import React from "react";

export default function JavaCareerCard() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-[#1c1f2e] rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10">
        
        {/* LEFT CONTENT */}
        <div className="flex-1 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Reimagine your career with Java
          </h2>

          <p className="text-gray-300 mb-6 max-w-xl">
            Master Java from core fundamentals to advanced backend development.
            Build real-world projects, crack interviews, and grow as a
            professional Java developer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              ☕ Learn Core & Advanced Java
            </div>
            <div className="flex items-center gap-2 text-sm">
              🧠 OOPs, DSA & Design Patterns
            </div>
            <div className="flex items-center gap-2 text-sm">
              🛠 Spring Boot & Microservices
            </div>
            <div className="flex items-center gap-2 text-sm">
              🚀 Crack Java Interviews
            </div>
          </div>

          <button className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition">
            Learn more
          </button>

          <p className="text-xs text-gray-400 mt-3">
            Starting at ₹499/month
          </p>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex gap-4 items-center">
          {/* Big Image */}
          <div className="w-44 h-60 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
            JAVA
          </div>

          {/* Stacked Cards */}
          <div className="flex flex-col gap-4">
            <div className="w-32 h-28 rounded-xl bg-[#2a2e45] flex items-center justify-center text-white text-sm">
              Spring Boot
            </div>

            <div className="w-32 h-28 rounded-xl bg-[#2a2e45] flex items-center justify-center text-white text-sm">
              Microservices
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
