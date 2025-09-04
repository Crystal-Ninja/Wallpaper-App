import React from "react";
import "./slides.css";

export const Slide = React.memo(function ({ data, dataIndex, isCenterSlide, swipeTo, slideIndex }) {
  const { image, text } = data[dataIndex];

  return (
    <div className="card-card w-full h-full flex flex-col items-center" draggable={false}>
      <div
        className={`cover relative w-full h-[70%] ${isCenterSlide ? "off" : "on"}`}
        onClick={() => {
          if (!isCenterSlide) swipeTo(slideIndex);
        }}
      >
        <img
          src={image}
          alt={text}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Description just below the image */}
      <div className="detail mt-2 text-center">
        <p className="text-white">{text}</p>
      </div>
    </div>
  );
});

