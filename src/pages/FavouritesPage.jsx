import { HiHeart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/Navbar/FavoritesContext";

export default function FavouritesPage() {
  const { favorites, toggleFavorite, loading } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center bg-[#eaf9ff] dark:bg-gray-900 py-20 text-lg font-semibold text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-200">
        Loading your favorites...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center bg-[#eaf9ff] dark:bg-gray-900 py-12 min-h-screen transition-colors duration-200">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Your Favorites is empty 😔
        </h2>
        <button
          onClick={() => navigate("/#courses")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-colors"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#eaf9ff] dark:bg-gray-900 mx-auto px-10 py-10 min-h-screen transition-colors duration-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Your Favorite Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/70 cursor-pointer transition-all"
          >
            <img
              src={fav.courseThumbnail}
              alt={fav.courseTitle}
              className="h-40 w-full object-cover hover:scale-105 transition-transform"
              onClick={() => navigate(`/course/${fav.courseId}`)}
            />

            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 dark:text-white">
                {fav.courseTitle}
              </h3>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-800 dark:text-white">
                  ₹{fav.coursePrice}
                </span>
              </div>
            </div>

            {/*  REMOVE FROM FAVORITES */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(fav.courseId);
              }}
              className="absolute top-3 right-3 text-red-500 p-1 rounded-full hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Remove from favorites"
            >
              <HiHeart size={22} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}