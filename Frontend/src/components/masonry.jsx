import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

export default function MasonryGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("drawings"); // default search
  const [searchText, setSearchText] = useState("drawings");

  // Fetch images from backend API
  async function fetchImages(q) {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/external?query=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setImages(data.items);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch images when component mounts OR query changes
  useEffect(() => {
    fetchImages(query);
  }, [query]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="p-4">
      {/* 🔎 Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search images..."
          className="w-full max-w-xl px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          {images.map((img) => (
            <a
              key={img.id}
              href={img.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={img.thumb}
                alt={img.author}
                className="mb-4 w-full rounded-xl shadow-md hover:scale-[1.02] transition"
              />
            </a>
          ))}
        </Masonry>
      )}
    </div>
  );
}
