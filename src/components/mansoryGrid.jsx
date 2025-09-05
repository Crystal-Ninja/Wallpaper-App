import Masonry from "react-masonry-css";

export default function MasonryGrid() {
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

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
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
  );
}
