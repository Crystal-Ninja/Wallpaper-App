import { div } from "framer-motion/client";
import Masonry from "react-masonry-css";
import { useState } from "react";

export default function MasonryGrid() {
  const [search, setSearch] = useState("");
  const images = [
    "/-3LMiFRI.jpeg",
    "/1sxS9LUf.jpeg",
    "/5JAfXYOd.jpeg",
    "/DdacpnyW.jpeg",
    "/nOvx8f3y.jpeg",
    "/oq383M6c.jpeg",
    "/-eH8XWNO.jpeg",
    "5Ii0lqzy.jpeg",
    "/7Qu4P8R4.jpeg",
    "/dFjmvksA.jpeg",
    "/MV33W7oy.jpeg",
    "/OKMwhXAt.jpeg",
    "/pNPAVC6n.jpeg",
    "/Y9lQKbRN.jpeg",
  ];
  const filteredImages = images.filter((src) =>
    src.toLowerCase().includes(search.toLowerCase())
  );
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      <div className="w-full mb-6 px-4 mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search images..."
          className="w-full px-4 py-2 rounded-sm bg-gray-800 text-white placeholder-gray-400 
                    border border-gray-600 focus:outline-none focus:ring-2 
                    focus:border-white shadow-sm"
        />
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-8"
        columnClassName="bg-clip-padding"
      >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="masonry"
          className="mb-8 w-full rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        />
      ))}
      </Masonry>

    </div>
  );
}
