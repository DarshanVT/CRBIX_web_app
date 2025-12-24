export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="container mx-auto px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">CDaX</h2>
            <p className="text-gray-400 text-sm">
              Learn skills for your present and future.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-3">Courses</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Web Development</li>
              <li>Java Programming</li>
              <li>Data Science</li>
              <li>UI/UX Design</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-3">
              Get updates on new courses.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="px-3 py-2 rounded-md bg-gray-800 text-gray-200 w-full"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CDaX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
