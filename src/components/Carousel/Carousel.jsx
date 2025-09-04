import React from "react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";

import { Slide } from "./slides.jsx";
const data = [
  {
    image: "https://picsum.photos/200/300/?random=1",
    text: "hello",
  },
  {
    image: "https://picsum.photos/200/300/?random=12",
    text: "lel",
  },
  {
    image: "https://picsum.photos/200/300/?random=13",
    text: "kak",
  },
  {
    image: "https://picsum.photos/200/300/?random=15",
    text: "kk",
  },
  {
    image: "https://picsum.photos/200/300/?random=10",
    text: "hello",
  },
];

const CardExample = () => {
  const ref = React.useRef();
  return (
    <div className="card ">
      <div className="w-full h-screen flex items-center justify-center">
        <ResponsiveContainer
          carouselRef={ref}
          render={(width, carouselRef) => {
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Slide}
                slides={data.length}
                slideWidth={400} 
                carouselWidth={window.innerWidth}
                data={data}
                maxVisibleSlide={5}
                disableSwipe
                customScales={[1, 0.85, 0.7, 0.55]}
                transitionTime={450}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default CardExample;


