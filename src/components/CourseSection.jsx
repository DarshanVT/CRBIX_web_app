import CourseCard from "./CourseCard";

const courses = [
  {
    title: "The AI Engineer Course 2025: Complete AI Engineer Bootcamp",
    author: "365 Careers",
    rating: "4.6",
    reviews: "13,420",
    price: "449",
    originalPrice: "3009",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800",
  },
  {
    title: "Intro to AI Agents and Agentic AI",
    author: "365 Careers",
    rating: "4.5",
    reviews: "5,843",
    price: "449",
    originalPrice: "799",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
  },
  {
    title: "Complete AI Automation And Agentic AI Bootcamp With n8n",
    author: "KRISHAI Technologies",
    rating: "4.5",
    reviews: "207",
    price: "449",
    originalPrice: "799",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
  },
  {
    title: "The Complete Guide To AI Powered Salesforce Development",
    author: "Matt Gerry",
    rating: "4.8",
    reviews: "106",
    price: "449",
    originalPrice: "799",
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
  },

  // 🔁 DUPLICATE / DEMO DATA (total 12)
  ...Array(8).fill(null).map((_, i) => ({
    title: `AI Course ${i + 5}`,
    author: "Udemy Instructor",
    rating: "4.6",
    reviews: "1,200",
    price: "449",
    originalPrice: "1999",
    badge: i % 2 === 0 ? "Bestseller" : "",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=800",
  })),
];

export default function CourseGridSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-1">
        Skills to transform your career and life
      </h2>
      <p className="text-gray-600 mb-8">
        From critical skills to technical topics, explore top courses.
      </p>

      {/* GRID 4 x 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* Footer Link */}
      <p className="text-purple-700 font-semibold text-sm mt-8 cursor-pointer">
        Show all Artificial Intelligence (AI) courses →
      </p>
    </section>
  );
}
