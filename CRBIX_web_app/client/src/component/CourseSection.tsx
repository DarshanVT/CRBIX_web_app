import CourseCard from "./CourseCard";

type Course = {
  title: string;
  learners: string;
  image: string;
};

const courses: Course[] = [
  {
    title: "Generative AI",
    learners: "1.7M+",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    title: "IT Certifications",
    learners: "14M+",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
  {
    title: "Data Science",
    learners: "8.1M+",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
];

export default function CourseSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn essential career and life skills
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Udemy helps you build in-demand skills fast and advance your career
            in a changing job market.
          </p>
        </div>

        {/* RIGHT CARDS */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

      </div>
    </section>
  );
}
