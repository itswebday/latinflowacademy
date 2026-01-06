"use client";

import React, { ReactNode } from "react";
import {
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { twMerge } from "tailwind-merge";

type SwiperContainerProps = {
  children: ReactNode;
  className?: string;
  spaceBetween: number;
};

const SwiperContainer: React.FC<SwiperContainerProps> = ({
  children,
  className,
  spaceBetween,
}) => {
  return (
    <div className={twMerge("overflow-visible", className)}>
      {/* Swiper */}
      <Swiper
        style={{
          paddingBottom: "2rem",
          overflow: "visible",
        }}
        modules={[FreeMode, Mousewheel, Navigation, Pagination, Scrollbar]}
        slidesPerView="auto"
        freeMode={true}
        allowTouchMove={true}
        scrollbar={{ draggable: true }}
        mousewheel={{ forceToAxis: true }}
      >
        {/* Slides */}
        {React.Children.map(children, (child, index) => (
          <SwiperSlide
            style={{
              width: "fit-content",
              paddingLeft: `${spaceBetween * 0.5}px`,
              paddingRight: `${spaceBetween * 0.5}px`,
            }}
            key={index}
          >
            {/* Component */}
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperContainer;
