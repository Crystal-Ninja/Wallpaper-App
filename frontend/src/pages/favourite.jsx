import { useEffect, useState } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { Heart, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "../config/api.js";



export default function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.ALL_FAVORITES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data.items);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const checkMobile = () => {
    setIsMobile(
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);


  const removeFavorite = async (favorite) => {
    try {
      const token = localStorage.getItem("token");
      
      if (favorite.type === 'external') {
        // Remove external favorite
        await axios.delete(API_ENDPOINTS.EXTERNAL_FAVORITE_REMOVE(favorite.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Remove internal favorite - you need to add this endpoint
        await axios.delete(`${API_ENDPOINTS.API_BASE_URL}/api/images/${favorite.id}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      
      // Remove from local state
      setFavorites(favorites.filter(fav => fav.id !== favorite.id));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Error removing favorite");
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 ml-20 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-base-content">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-base-300 mb-4" />
          <p className="text-base-content/70 text-lg">No favorites yet</p>
          <p className="text-base-content/40">Start adding images to your favorites!</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="bg-clip-padding"
        >
          {favorites.map((fav) => (
            <div key={`${fav.type}-${fav.id}`} className="relative group mb-4">
              <img
                src={fav.url || fav.thumb}
                alt={fav.Title || fav.title || "Favorite image"}
                className="w-full rounded-xl shadow-md hover:scale-[1.02] transition border border-base-300"
                loading="lazy"
              />
              
              {/* Remove from favorites button */}
              <button
                onClick={() => removeFavorite(fav)}
                className={`absolute top-2 right-2 btn btn-circle btn-error text-white transition-all duration-200 
                  ${isMobile 
                    ? 'opacity-90'   // always visible on mobile
                    : 'opacity-0 group-hover:opacity-100'}
                `}
                style={{ width: "40px", height: "40px" }} // touch-friendly
                title="Remove from favorites"
              >
                <Trash2 size={32} />
              </button>

              
              {/* Image type indicator */}
              <div className="absolute top-2 left-2 badge badge-primary badge-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {fav.type === 'external' ? 'Unsplash' : 'Uploaded'}
              </div>
              
              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-300/80 to-transparent text-base-content p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                {fav.Title || fav.title ? (
                  <p className="text-sm font-medium">{fav.Title || fav.title}</p>
                ) : null}
                {fav.author && (
                  <p className="text-xs opacity-75">by {fav.author}</p>
                )}
                {fav.dateAdded && (
                  <p className="text-xs opacity-75">
                    Added {new Date(fav.dateAdded).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}