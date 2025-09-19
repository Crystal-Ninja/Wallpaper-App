import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

export default function MasonryGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
  if (query) {
    setImages([]); // ✅ clear local images when searching
  }
  fetchImages(query);
}, [query]);


  // Fetch images from backend API
  async function fetchImages(q) {
    try {
      
      setLoading(true);
      const res = await fetch(
        `${API_ENDPOINTS.EXTERNAL_IMAGES}?query=${encodeURIComponent(q)}`
      );
      


      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      // merge old + new
      setImages((prev) => {
        const seen = new Set();
        return [...prev, ...(data.items || [])].filter((img) => {
          if (seen.has(img.id)) return false; // duplicate → skip
          seen.add(img.id);
          return true;
        });
      });

      
      // Check favorite status for each image (if user is logged in)
      const token = localStorage.getItem("token");
      if (token && data.items?.length > 0) {
        checkFavoriteStatus(data.items);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      setImages([]);
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
          // Skip backend check for local images, just set favorite to false by default
          if (img.id.startsWith("local") || img.type === "local") {
            return { id: img.id, isFavorite: false };
          }

          const res = await axios.get(
            API_ENDPOINTS.EXTERNAL_FAVORITE_CHECK(img.id),
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            }
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

      // Don't allow favoriting local images for now (they don't have backend support)


      const isFavorite = favoriteStatus[img.id] || false;

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(API_ENDPOINTS.EXTERNAL_FAVORITE_REMOVE(img.id), {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
      } else {
        // Add to favorites
        await axios.post(
          API_ENDPOINTS.EXTERNAL_FAVORITE,
          {
            externalId: img.id,
            url: img.url,
            thumb: img.thumb,
            author: img.author,
            title: `Image by ${img.author}`
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
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
      } else if (err.code === 'ECONNABORTED') {
        alert("Request timed out. Please try again.");
      } else {
        alert("Error updating favorite. Please try again.");
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
    <div className="p-4 ml-20 bg-base-100 min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search images..."
          className="input input-bordered w-full max-w-xl"
          onKeyPress={(e) => e.key === 'Enter' && setQuery(searchText)}
        />
        <button
          onClick={() => setQuery(searchText)}
          className="btn btn-primary ml-2"
        >
          Search
        </button>
      </div>

      {/* Masonry Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-base-content/70 text-lg">No images found</p>
        </div>
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
                  className="block"
                >
                  <img
                    src={img.thumb}
                    alt={img.author}
                    className="w-full rounded-xl shadow-md hover:scale-[1.02] transition border border-base-300"
                    loading="lazy"
                  />
                </a>
                
                {/* Favorite button - Always visible on mobile, hover on desktop */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(img);
                  }}
                  className={`absolute top-2 right-2 btn btn-circle transition-all duration-200 
                    ${isMobile 
                      ? 'opacity-90'   // always visible on mobile
                      : 'opacity-0 group-hover:opacity-100'} 
                    ${isFavorite 
                      ? 'btn-error text-pink-800' 
                      : 'btn-ghost bg-base-100/90 hover:btn-error'}
                  `}
                  style={{ width: "40px", height: "40px" }} // bigger tap target
                >
                  <Heart 
                    size={32} // slightly bigger
                    fill={isFavorite ? "currentColor" : "none"} 
                  />
                </button>


                {/* Image type indicator - show if local image */}
                {(img.id.startsWith("local") || img.type === "local") && (
                  <div className={`absolute top-2 left-2 badge badge-primary badge-sm transition-opacity ${
                    isMobile ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    Local
                  </div>
                )}

                {/* Author info - Always show on mobile, hover on desktop */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-300/90 to-transparent text-base-content p-3 rounded-b-xl transition-opacity ${
                  isMobile ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'
                }`}>
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