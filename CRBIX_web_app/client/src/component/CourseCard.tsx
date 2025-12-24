type Course = {
  title: string;
  learners: string;
  image: string;
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="min-w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer">
      
      {/* IMAGE */}
      <div className="h-44 overflow-hidden rounded-t-2xl">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <span className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          👥 {course.learners}
        </span>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {course.title}
          </h3>
          <span className="text-xl">→</span>
        </div>
      </div>
    </div>
  );
}
