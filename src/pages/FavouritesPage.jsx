
import { HiHeart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";

export default function FavouritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Your Favorites is empty 😔</h2>
        <button onClick={() => navigate("/#courses")} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Your Favorite Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {favorites.map((course) => (
          <div key={course.id} className="relative bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg cursor-pointer">
            <img
              src={course.image}
              alt={course.title}
              className="h-40 w-full object-cover hover:scale-105 transition-transform"
              onClick={() => navigate(`/course/${course.id}`)}
            />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2">{course.title}</h3>
              <p className="text-xs text-gray-500">{course.author}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">₹{course.price}</span>
                <span className="text-xs line-through text-gray-400">{course.originalPrice}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(course); }}
              className="absolute top-3 right-3 text-red-500 p-1 rounded-full"
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
