import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1c1d1f] text-gray-300 text-sm">
      {/* Top companies strip */}
      <div className="border-b border-gray-700 px-8 py-4">
        <p className="text-center text-gray-400">
          Top companies choose Cdax Business to build in-demand career skills.
        </p>
      </div>

      {/* Main footer content */}
      <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Column 1 */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            In-demand Careers
          </h4>
          <ul className="space-y-2">
            <li>Data Scientist</li>
            <li>Full Stack Web Developer</li>
            <li>Cloud Engineer</li>
            <li>Project Manager</li>
            <li>Game Developer</li>
            <li className="text-purple-400 cursor-pointer">
              All Career Accelerators
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Web Development
          </h4>
          <ul className="space-y-2">
            <li>JavaScript</li>
            <li>React JS</li>
            <li>Angular</li>
            <li>Java</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            IT Certifications
          </h4>
          <ul className="space-y-2">
            <li>Amazon AWS</li>
            <li>AWS Cloud Practitioner</li>
            <li>Azure Fundamentals</li>
            <li>AWS Solutions Architect</li>
            <li>Kubernetes</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Data Science
          </h4>
          <ul className="space-y-2">
            <li>Python</li>
            <li>Machine Learning</li>
            <li>ChatGPT</li>
            <li>Deep Learning</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Business Analytics
          </h4>
          <ul className="space-y-2">
            <li>Microsoft Excel</li>
            <li>SQL</li>
            <li>Power BI</li>
            <li>Business Analysis</li>
          </ul>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-700 px-8 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">CDaX</span>
          <span className="text-gray-400">
            © 2025 CDaX, Inc.
          </span>
        </div>

        <div className="mt-3 md:mt-0 flex gap-6">
          <span className="cursor-pointer hover:text-white">
            Terms
          </span>
          <span className="cursor-pointer hover:text-white">
            Privacy policy
          </span>
          <span className="cursor-pointer hover:text-white">
            Sitemap
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
