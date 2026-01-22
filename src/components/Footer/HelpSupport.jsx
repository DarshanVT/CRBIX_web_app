export default function HelpSupport() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900">
    <section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Help & Support
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: <span className="font-medium dark:text-gray-300">01-01-2026</span>
      </p>

      <p className="mb-8 dark:text-gray-300">
        Welcome to the CDaX Help & Support section. We're here to help you get the
        best learning experience. Whether you have questions about courses,
        payments, or technical issues, you'll find helpful information below.
      </p>

      {/* Account */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Account & Login
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>How to create a new account</li>
        <li>Logging in or signing up</li>
        <li>Resetting a forgotten password</li>
        <li>Updating profile information</li>
        <li>Managing saved courses and favorites</li>
      </ul>

      {/* Courses */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Courses & Learning
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Browsing and searching for courses</li>
        <li>Enrolling in a course</li>
        <li>Accessing purchased courses</li>
        <li>Tracking course progress</li>
        <li>Certificates (where applicable)</li>
      </ul>

      {/* Payments */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Payments & Billing
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Course pricing and plans</li>
        <li>Secure payment methods</li>
        <li>Payment failures or pending transactions</li>
        <li>Refunds and cancellations</li>
        <li>Invoices and receipts</li>
      </ul>

      {/* Cart */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Cart & Favorites
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Adding or removing courses from the cart</li>
        <li>Managing favorite courses</li>
        <li>Checkout-related issues</li>
      </ul>

      {/* Technical */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Technical Support
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Website loading or performance issues</li>
        <li>Video playback problems</li>
        <li>Browser or device compatibility</li>
        <li>Reporting bugs or errors</li>
      </ul>

      {/* Privacy */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Privacy & Security
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Account security best practices</li>
        <li>Data privacy and protection</li>
        <li>Reporting suspicious activity</li>
      </ul>

      {/* Contact */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Contact Support
      </h2>
      <p className="mb-4 dark:text-gray-300">
        If you can't find the answer you're looking for, our support team is
        happy to help.
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
      <p className="mb-2 dark:text-gray-300">
        ⏱️ <strong className="dark:text-white">Response Time:</strong> Within 24–48 business hours
      </p>
      <p className="mb-6 dark:text-gray-300">
        🕘 <strong className="dark:text-white">Support Hours:</strong> Monday – Friday, 10:00 AM – 7:00 PM (IST)
      </p>

      {/* Accessibility */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Accessibility Support
      </h2>
      <p className="mb-6 dark:text-gray-300">
        If you experience any accessibility-related issues while using CDaX,
        please contact us. We are committed to making learning accessible to
        everyone.
      </p>

      {/* Feedback */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Feedback & Improvements
      </h2>
      <p className="mb-6 dark:text-gray-300">
        Your feedback helps us improve. We continuously enhance our platform
        based on user suggestions and support requests.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        This Help & Support section is provided for guidance and does not replace
        official communication where required.
      </p>
    </section>
    </div>
  );
}