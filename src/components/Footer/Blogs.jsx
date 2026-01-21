import React from "react";
import { Link } from "react-router-dom";

const blogs = [
  {
    id: 1,
    title: "Why Java Is Still a Top Career Choice in 2025",
    excerpt:
      "Java continues to dominate enterprise applications, backend systems, and Android development. Learn why it's still relevant.",
    author: "CDaX Team",
    date: "Jan 10, 2025",
    category: "Programming",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
  },
  {
    id: 2,
    title: "Python vs Java: Which One Should You Learn First?",
    excerpt:
      "Confused between Python and Java? This guide helps beginners choose the right language based on career goals.",
    author: "CDaX Experts",
    date: "Feb 02, 2025",
    category: "Career Guide",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800",
  },
  {
    id: 3,
    title: "How AI & Machine Learning Are Changing the IT Industry",
    excerpt:
      "AI and ML are transforming software development, analytics, and automation. Here's what students should know.",
    author: "CDaX Research",
    date: "Mar 18, 2025",
    category: "AI & ML",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  },
];

export default function Blogs() {
  return (
    <section className="w-full mx-auto px-4 pt-5 pb-5 dark:bg-gray-900">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">CDaX Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Insights, tutorials, and career guidance to help you grow in tech and
          build a successful future.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-800/50 transition duration-300 overflow-hidden"
          >
            {/* Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-6">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                {blog.category}
              </span>

              <h2 className="text-xl font-bold mt-2 mb-3 line-clamp-2 dark:text-white">
                {blog.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                <span>{blog.author}</span>
                <span>{blog.date}</span>
              </div>

              <Link
                to="#"
                className="inline-block mt-5 text-purple-700 dark:text-purple-400 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold mb-3 dark:text-white">
          Want to learn faster with expert guidance?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore our industry-focused courses designed for real-world skills.
        </p>
        <Link
          to="/courses"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Explore Courses
        </Link>
      </div>
    </section>
  );
}