import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Effective Date: 01 January 2026
        </p>

        <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-3">
          <p>
            Welcome to <strong className="text-gray-900 dark:text-white">CDaX Academy</strong>. CDaX Academy is an online
            learning platform designed for individual learners to access
            educational courses, training programs, and learning resources.
          </p>
          <p>
            We respect your privacy and are committed to protecting your
            personal data. This Privacy Policy explains how your information is
            collected, used, stored, and protected when you use our website,
            mobile application, and services.
          </p>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Name, email address, and phone number</li>
            <li>Login credentials (stored securely)</li>
            <li>Course enrollment and learning progress</li>
            <li>Payment details processed by third-party providers</li>
            <li>Technical data such as IP address and browser type</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Create and manage user accounts</li>
            <li>Provide access to courses and learning materials</li>
            <li>Process payments and subscriptions</li>
            <li>Send important notifications and updates</li>
            <li>Improve platform performance and user experience</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use cookies to maintain login sessions, remember preferences, and
            analyze platform usage. Disabling cookies may affect some features.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use standard security measures such as encryption and secure
            servers to protect your data. However, no online system is 100%
            secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            5. Third-Party Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may use trusted third-party services for payments, analytics, and
            communication. These services follow their own privacy policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Children's Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our platform is not intended for children under the age of 13. We do
            not knowingly collect personal data from children.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You may access, update, or delete your personal information at any
            time by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page.
          </p>
        </section>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Contact us at:{" "}
            <a
              href="mailto:info.crbix@gmail.com?subject=Support%20Request"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              info.crbix@gmail.com
            </a>
          </p>

          <p className="mt-1">Address: Pune, Maharashtra, India</p>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;