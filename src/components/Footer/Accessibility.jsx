export default function Accessibility() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900">
    <section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Accessibility Statement
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: <span className="font-medium dark:text-gray-300">01-01-2026</span>
      </p>

      <p className="mb-6 dark:text-gray-300">
        At <strong className="dark:text-white">CDaX Learning Platform</strong>, we are committed to ensuring
        digital accessibility for all users, including people with disabilities.
        We continuously work to improve the user experience for everyone and
        apply relevant accessibility standards wherever possible.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Our Commitment to Accessibility
      </h2>
      <p className="mb-4 dark:text-gray-300">
        We strive to make our website and learning content accessible to users
        with visual, auditory, motor, and cognitive disabilities. Our goal is to
        ensure that everyone can access and benefit from our educational
        services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Accessibility Features
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-2 dark:text-gray-300">
        <li>Semantic HTML for improved screen reader support</li>
        <li>Keyboard-accessible navigation across the platform</li>
        <li>Clear text with sufficient color contrast</li>
        <li>Accessible forms with proper labels and focus indicators</li>
        <li>Responsive design for mobile, tablet, and desktop devices</li>
        <li>Alternative text for meaningful images</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Accessibility Standards
      </h2>
      <p className="mb-4 dark:text-gray-300">
        We aim to follow accessibility best practices based on the{" "}
        <strong className="dark:text-white">Web Content Accessibility Guidelines (WCAG) 2.1 – Level AA</strong>.
        While we strive for full compliance, some areas may still be under
        improvement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Known Limitations
      </h2>
      <p className="mb-4 dark:text-gray-300">
        Despite our efforts, some content may not yet be fully accessible, such
        as third-party tools, embedded services, or older course materials. We
        are actively working to improve these areas.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Feedback & Support
      </h2>
      <p className="mb-4 dark:text-gray-300">
        If you experience any difficulty accessing our platform or content, we
        encourage you to contact us. Your feedback helps us improve accessibility
        for everyone.
      </p>

      <p className="mb-2 dark:text-gray-300">
        📧 <strong className="dark:text-white">Email : </strong> 
        <a
              href="mailto:info.crbix@gmail.com?subject=Support%20Request"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              info.crbix@gmail.com
            </a>
      </p>
      <p className="mb-6 dark:text-gray-300">
        🌐 <strong className="dark:text-white">Website:</strong> www.cdaxlearning.com
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 dark:text-white">
        Continuous Improvement
      </h2>
      <p className="mb-4 dark:text-gray-300">
        Accessibility is an ongoing effort. We regularly review our platform,
        update features, and test usability to ensure inclusive access for all
        learners.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        This Accessibility Statement is provided in good faith and does not
        create any legal rights beyond applicable laws.
      </p>
    </section>
    </div>
  );
}