export default function Careers() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#eaf9ff] dark:bg-gray-900">
    <section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Careers at CDaX
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: <span className="font-medium dark:text-gray-300">01-01-2026</span>
      </p>

      {/* Intro */}
      <p className="text-lg mb-6 dark:text-gray-300">
        At <strong className="dark:text-white">CDaX</strong>, we are building a learning platform that helps
        people transform their careers through technology and practical
        education. If you are passionate about learning, innovation, and
        creating real impact — we'd love to work with you.
      </p>

      <p className="mb-8 dark:text-gray-300">
        We believe great products are built by curious minds, collaborative
        teams, and a culture that values growth and ownership.
      </p>

      {/* Why Work With Us */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Why Work at CDaX?
      </h2>

      <ul className="list-disc pl-6 space-y-2 mb-8 dark:text-gray-300">
        <li>Work on a product that directly impacts learners and careers</li>
        <li>Collaborate with a passionate and growing tech team</li>
        <li>Opportunity to learn, grow, and take ownership</li>
        <li>Flexible work environment and modern tech stack</li>
        <li>Culture that values ideas, innovation, and integrity</li>
      </ul>

      {/* Teams */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Teams at CDaX
      </h2>

      <ul className="list-disc pl-6 space-y-2 mb-8 dark:text-gray-300">
        <li>Engineering (Frontend, Backend, Full Stack)</li>
        <li>UI/UX & Product Design</li>
        <li>Content & Course Development</li>
        <li>Quality Assurance & Testing</li>
        <li>Marketing & Growth</li>
        <li>Support & Operations</li>
      </ul>

      {/* Current Openings */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Current Openings
      </h2>

      <p className="mb-6 dark:text-gray-300">
        We are always looking for talented individuals. Current opportunities
        may include:
      </p>

      <ul className="list-disc pl-6 space-y-2 mb-8 dark:text-gray-300">
        <li>Frontend Developer (React)</li>
        <li>Backend Developer (Java / Spring Boot / Node.js)</li>
        <li>Full Stack Developer</li>
        <li>UI/UX Designer</li>
        <li>Technical Content Creator / Instructor</li>
        <li>QA Engineer</li>
      </ul>

      {/* Freshers */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        Opportunities for Freshers & Interns
      </h2>

      <p className="mb-8 dark:text-gray-300">
        CDaX welcomes fresh graduates and interns who are eager to learn,
        experiment, and grow in a real-world development environment. Interns
        get hands-on exposure, mentorship, and the opportunity to work on
        production-level projects.
      </p>

      {/* How to Apply */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
        How to Apply
      </h2>

      <p className="mb-6 dark:text-gray-300">
        If you're interested in joining CDaX, please send your resume and a
        brief introduction about yourself to:
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

      <p className="text-gray-600 dark:text-gray-400">
        We review applications on a rolling basis and will reach out if your
        profile matches our current or upcoming requirements.
      </p>
    </section>
    </div>
  );
}