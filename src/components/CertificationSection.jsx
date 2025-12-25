import React from "react";

const certifications = [
  {
    title: "CompTIA",
    desc: "Cloud, AI, Coding, Networking, Cybersecurity",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600",
  },
  {
    title: "AWS",
    desc: "Cloud, AI, Coding, Networking",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
  },
  {
    title: "PMI",
    desc: "Project & Program Management",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600",
  },
];

export default function CertificationSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-[#2E3133] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* LEFT CONTENT */}
        <div className="flex-1 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get certified and get ahead in your career
          </h2>
          <p className="text-gray-300 mb-6">
            Prep for certifications with comprehensive courses, practice tests,
            and special offers on exam vouchers.
          </p>

          <button className="flex items-center gap-2 text-purple-400 font-semibold hover:underline">
            Explore certifications and vouchers →
          </button>
        </div>

        {/* RIGHT CARDS */}
        <div className="flex gap-4 flex-wrap justify-center md:justify-end">
          {certifications.map((item, index) => (
            <div
              key={index}
              className="
  w-44 bg-[#464747] rounded-xl p-4 cursor-pointer
  transition-all duration-300
  hover:scale-105
  hover:shadow-[0_0_20px_#eaf9ff]
"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-24 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="text-white font-semibold">{item.title}</h3>
              <p className="text-xs text-gray-300 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
