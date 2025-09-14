import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";
import axios from "axios";

export default function MasonryGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [favoriteStatus, setFavoriteStatus] = useState({});

  // Fetch images from backend API
  async function fetchImages(q) {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/external?query=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setImages(data.items);
      
      // Check favorite status for each image (if user is logged in)
      const token = localStorage.getItem("token");
      if (token) {
        checkFavoriteStatus(data.items);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }

  // Check which images are favorited
  async function checkFavoriteStatus(imageList) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const statusPromises = imageList.map(async (img) => {
        try {
          const res = await axios.get(
            `http://localhost:5000/images/external/${img.id}/is-favorite`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return { id: img.id, isFavorite: res.data.isFavorite };
        } catch (err) {
          console.error(`Error checking favorite status for ${img.id}:`, err);
          return { id: img.id, isFavorite: false };
        }
      });

      const statusResults = await Promise.all(statusPromises);
      const statusMap = {};
      statusResults.forEach(({ id, isFavorite }) => {
        statusMap[id] = isFavorite;
      });
      setFavoriteStatus(statusMap);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  }

  useEffect(() => {
    fetchImages(query);
  }, [query]);

  const toggleFavorite = async (img) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add favorites");
        return;
      }

      const isFavorite = favoriteStatus[img.id] || false;

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/images/external/${img.id}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add to favorites
        await axios.post(
          `http://localhost:5000/images/external-favorite`,
          {
            externalId: img.id,
            url: img.url,
            thumb: img.thumb,
            author: img.author,
            title: `Image by ${img.author}`
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Update local state
      setFavoriteStatus(prev => ({
        ...prev,
        [img.id]: !isFavorite
      }));

    } catch (err) {
      console.error("Error toggling favorite:", err);
      if (err.response?.status === 401) {
        alert("Please login to add favorites");
      } else {
        alert("Error updating favorite");
      }
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="p-4 ml-20">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search images..."
          className="w-full max-w-xl px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyPress={(e) => e.key === 'Enter' && setQuery(searchText)}
        />
        <button
          onClick={() => setQuery(searchText)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Masonry Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500">No images found</p>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="bg-clip-padding"
        >
          {images.map((img) => {
            const isFavorite = favoriteStatus[img.id] || false;
            
            return (
              <div key={img.id} className="relative group mb-4">
                <a
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={img.thumb}
                    alt={img.author}
                    className="w-full rounded-xl shadow-md hover:scale-[1.02] transition"
                  />
                </a>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(img);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                  }`}
                >
                  <Heart 
                    size={16} 
                    fill={isFavorite ? "currentColor" : "none"} 
                  />
                </button>

                {/* Author info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium">by {img.author}</p>
                </div>
              </div>
            );
          })}
        </Masonry>
      )}
    </div>
  );
}