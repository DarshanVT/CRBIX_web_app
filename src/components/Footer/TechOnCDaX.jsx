export default function TechOnCDaX() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900">
    <section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Tech on CDaX
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: <span className="font-medium dark:text-gray-300">01-01-2026</span>
      </p>

      <p className="mb-8 dark:text-gray-300">
        CDaX Learning Platform is built using modern, scalable, and
        industry-standard technologies to ensure a fast, secure, and
        user-friendly learning experience.
      </p>

      {/* Frontend */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Frontend Technologies
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">React.js</strong> – Component-based UI development</li>
        <li><strong className="dark:text-white">React Router DOM</strong> – Client-side routing</li>
        <li><strong className="dark:text-white">Tailwind CSS</strong> – Responsive and modern styling</li>
        <li><strong className="dark:text-white">JavaScript (ES6+)</strong> – Interactive functionality</li>
        <li><strong className="dark:text-white">HTML5 & CSS3</strong> – Semantic structure and accessibility</li>
      </ul>

      {/* Backend */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Backend Technologies
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">Spring Boot (Java)</strong> – RESTful backend services</li>
        <li><strong className="dark:text-white">Spring Security</strong> – Authentication & authorization</li>
        <li><strong className="dark:text-white">JWT</strong> – Secure user sessions</li>
        <li><strong className="dark:text-white">Hibernate / JPA</strong> – Database ORM layer</li>
      </ul>

      {/* Database */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Database
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">MySQL</strong> – Primary relational database</li>
      </ul>

      {/* Payments */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Payments & Security
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">Razorpay / Stripe</strong> – Secure payment processing</li>
        <li><strong className="dark:text-white">HTTPS / SSL</strong> – Encrypted data transfer</li>
      </ul>

      {/* Auth */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Authentication & User Management
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Role-based access (Student / Admin / Instructor)</li>
        <li>Secure password encryption</li>
        <li>Protected frontend routes</li>
      </ul>

      {/* Hosting */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Hosting & Deployment
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li><strong className="dark:text-white">Frontend:</strong> Vercel / Netlify</li>
        <li><strong className="dark:text-white">Backend:</strong> AWS / Render / Railway</li>
        <li><strong className="dark:text-white">Database:</strong> AWS RDS / Cloud SQL</li>
      </ul>

      {/* State */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        State Management
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>React Context API (Auth, Cart, Favorites)</li>
        <li>LocalStorage & SessionStorage</li>
      </ul>

      {/* Tools */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Development Tools
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>Git & GitHub – Version control</li>
        <li>VS Code – Development environment</li>
        <li>Postman – API testing</li>
        <li>npm / yarn – Package management</li>
      </ul>

      {/* Accessibility */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">
        Accessibility & Performance
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
        <li>WCAG 2.1 accessibility guidelines</li>
        <li>Responsive and mobile-first design</li>
        <li>Lazy loading & optimized performance</li>
      </ul>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        This technology stack allows CDaX to scale efficiently while delivering
        a reliable and inclusive learning experience.
      </p>
    </section>
    </div>
  );
}