"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "@/components/icons";

type ScrollDownIndicatorProps = {
  className?: string;
};

const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({
  className,
}) => {
  const homeT = useTranslations("home");
  const indicatorRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!indicatorRef.current) {
      return;
    }

    const rectangle = indicatorRef.current.getBoundingClientRect();
    const scrollPosition = window.scrollY + rectangle.bottom + 16;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={twMerge(
        "flex flex-col items-center gap-4 opacity-60 cursor-pointer",
        "transition-opacity duration-300 hover:opacity-80",
        className,
      )}
      ref={indicatorRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={homeT("scrollDown")}
    >
      {/* Text */}
      <span className="text-[13px] font-semibold">{homeT("scrollDown")}</span>

      {/* Arrow */}
      <ChevronDown className="w-8 h-8 animate-bounce" />
    </div>
  );
};

export default ScrollDownIndicator;
