export default function AboutUs() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900">
    <section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        About CDaX
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: <span className="font-medium dark:text-gray-300">01-01-2026</span>
      </p>

      {/* Intro */}
      <p className="mb-6 text-lg dark:text-gray-300">
        <strong className="dark:text-white">CDaX</strong> is a modern online learning platform designed to
        empower students, freshers, and professionals with practical,
        job-ready skills in technology and software development.
      </p>

      <p className="mb-8 dark:text-gray-300">
        Our mission is to bridge the gap between academic knowledge and
        real-world industry requirements by offering high-quality courses,
        hands-on learning, and expert-guided training.
      </p>

      {/* Vision */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Our Vision
      </h2>
      <p className="mb-6 dark:text-gray-300">
        To become a trusted global learning platform that helps learners build
        meaningful careers through accessible, affordable, and industry-aligned
        education.
      </p>

      {/* Mission */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Our Mission
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Provide practical, skill-based learning experiences</li>
        <li>Offer affordable and high-value courses</li>
        <li>Help learners stay relevant in a fast-changing tech industry</li>
        <li>Support continuous learning and career growth</li>
      </ul>

      {/* What We Offer */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        What We Offer
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Programming and software development courses</li>
        <li>Web, mobile, and backend development training</li>
        <li>Data analytics, AI & ML, and cloud-related learning paths</li>
        <li>Career-focused skill development for freshers and professionals</li>
        <li>Structured courses with real-world examples</li>
      </ul>

      {/* Who It's For */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Who CDaX Is For
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Students looking to strengthen technical foundations</li>
        <li>Freshers preparing for IT and software roles</li>
        <li>Working professionals upgrading their skills</li>
        <li>Career switchers entering the tech industry</li>
      </ul>

      {/* Values */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Our Core Values
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">Quality:</strong> Industry-relevant and up-to-date content</li>
        <li><strong className="dark:text-white">Accessibility:</strong> Learning for everyone, everywhere</li>
        <li><strong className="dark:text-white">Integrity:</strong> Transparent and learner-first approach</li>
        <li><strong className="dark:text-white">Growth:</strong> Continuous improvement for learners and platform</li>
      </ul>

      {/* Why Choose */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Why Choose CDaX?
      </h2>
      <p className="mb-6 dark:text-gray-300">
        CDaX focuses on practical learning, not just theory. Our platform is
        built using modern technologies, designed for accessibility, and guided
        by a commitment to helping learners succeed in real-world careers.
      </p>

      {/* Closing */}
      <p className="mt-10 text-gray-600 dark:text-gray-400">
        Whether you're starting your journey in technology or advancing your
        professional skills, CDaX is here to support you every step of the way.
      </p>
    </section>
    </div>
  );
}