import { HiChevronRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function EnrolledCoursesModal({ courses = [], onClose }) {
  const navigate = useNavigate();

  const handleCourseClick = (courseId) => {
    onClose();
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Enrolled Courses</h2>
        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No enrolled courses yet
          </p>
        ) : (
          courses.map((c) => {
            const progress =
              c.progressPercentage ??
              c.progressPercent ??
              0;

            return (
              <div
                key={c.id}
                onClick={() => handleCourseClick(c.id)}
                className="flex gap-3 py-3 px-2 border-b cursor-pointer hover:bg-gray-50 transition"
              >
                {/* Thumbnail */}
                <img
                  src={c.thumbnailUrl}
                  alt={c.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {c.title}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progress}% completed
                    </p>
                  </div>
                </div>

                <HiChevronRight className="text-gray-400 mt-1" />
              </div>
            );
          })
        )}

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
