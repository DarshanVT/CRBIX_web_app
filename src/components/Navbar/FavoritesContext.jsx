import { createContext, useContext, useEffect, useState } from "react";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../../Api/favoriteApi";
import { useAuth } from "../Login/AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // assumes user.id exists
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD FAVORITES FROM BACKEND =================
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setFavorites([]);
      return;
    }

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getUserFavorites(user.id);
        setFavorites(data); 
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user?.id]);

  // ================= TOGGLE FAVORITE =================
  const toggleFavorite = async (courseId) => {
    if (!isAuthenticated || !user?.id) return;

    const exists = favorites.some(
      (fav) => fav.courseId === courseId
    );

    try {
      if (exists) {
        await removeFromFavorites(user.id, courseId);
        setFavorites((prev) =>
          prev.filter((fav) => fav.courseId !== courseId)
        );
      } else {
        const added = await addToFavorites(user.id, courseId);
        setFavorites((prev) => [...prev, added]);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);