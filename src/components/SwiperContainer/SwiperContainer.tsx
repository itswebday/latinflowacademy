"use client";

import React, { ReactNode } from "react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import { twMerge } from "tailwind-merge";

type SwiperContainerProps = {
  children: ReactNode;
  className?: string;
  spaceBetween?: number;
  slidesPerView?: "auto" | number;
  freeMode?: boolean;
  allowTouchMove?: boolean;
  mousewheel?: boolean;
  breakpoints?: SwiperOptions["breakpoints"];
  slideClassName?: string;
};

const SwiperContainer: React.FC<SwiperContainerProps> = ({
  children,
  className,
  spaceBetween = 16,
  slidesPerView = "auto",
  freeMode = true,
  allowTouchMove = true,
  mousewheel = true,
  breakpoints,
  slideClassName,
}) => {
  const modules = [FreeMode];
  if (mousewheel) {
    modules.push(Mousewheel);
  }

  return (
    <div className={twMerge("w-full", className)}>
      {/* Swiper */}
      <Swiper
        className="!overflow-visible"
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        freeMode={freeMode}
        allowTouchMove={allowTouchMove}
        mousewheel={mousewheel ? { forceToAxis: true } : false}
        breakpoints={breakpoints}
        grabCursor={true}
        style={{
          // Hide scrollbar
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Slides */}
        {React.Children.map(children, (child, index) => (
          <SwiperSlide
            className={twMerge(
              slidesPerView === "auto" && "!w-auto",
              slideClassName,
            )}
            key={index}
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperContainer;
