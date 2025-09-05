// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const images = [
//   "https://picsum.photos/800/400?random=1",
//   "https://picsum.photos/800/400?random=2",
//   "https://picsum.photos/800/400?random=3",
//   "https://picsum.photos/800/400?random=4",
// ];

// export default function Carousel() {
//   const [index, setIndex] = useState(0);

//   const nextSlide = () => {
//     setIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setIndex((prev) => (prev - 1 + images.length) % images.length);
//   };


//   useEffect(() => {
//     const timer = setInterval(nextSlide, 3000); // change slide every 3s
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="relative w-full max-w-4xl items-center justify-center mx-auto overflow-hidden">
//       <div className="relative h-150  flex items-center justify-center">
//         <AnimatePresence mode="wait">
//           <motion.img
            
//             key={images[index]}
//             src={images[index]}
//             alt={`Slide ${index + 1}`}
//             initial={{ opacity: 0, x: 100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -100 }}
//             transition={{ duration: 0.5 }}
//             className="w-[800px] h-[500px] object-cover rounded-xl shadow-xl"
//           />
//         </AnimatePresence>
//       </div>

//       {/* Navigation buttons */}
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
//       >
//         <ChevronLeft />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
//       >
//         <ChevronRight />
//       </button>
//     </div>
//   );
// }