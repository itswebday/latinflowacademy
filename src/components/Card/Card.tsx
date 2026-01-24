"use client";

import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  imageUrl?: string;
  imageAlt?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  color?: "primary" | "blue" | "green" | "red" | "orange" | "yellow";
};

const Card: React.FC<CardProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  leftLabel,
  rightLabel,
  className,
  children,
  color = "primary",
}) => {
  const getColorClasses = () => {
    const colorMap = {
      primary:
        "border-primary/40 shadow-primary/20 hover:border-primary/60 hover:shadow-primary/30",
      blue: "border-blue/40 shadow-blue/20 hover:border-blue/60 hover:shadow-blue/30",
      green:
        "border-green/40 shadow-green/20 hover:border-green/60 hover:shadow-green/30",
      red: "border-red/40 shadow-red/20 hover:border-red/60 hover:shadow-red/30",
      orange:
        "border-orange/40 shadow-orange/20 hover:border-orange/60 hover:shadow-orange/30",
      yellow:
        "border-yellow/40 shadow-yellow/20 hover:border-yellow/60 hover:shadow-yellow/30",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getGradientOverlay = () => {
    const colorMap = {
      primary:
        "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
      blue: "bg-linear-to-br from-blue/10 via-transparent to-blue/5",
      green: "bg-linear-to-br from-green/10 via-transparent to-green/5",
      red: "bg-linear-to-br from-red/10 via-transparent to-red/5",
      orange: "bg-linear-to-br from-orange/10 via-transparent to-orange/5",
      yellow: "bg-linear-to-br from-yellow/10 via-transparent to-yellow/5",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getHoverGradientOverlay = () => {
    if (color === "primary") {
      return "group-hover:from-primary/15 group-hover:to-secondary/15";
    }
    const colorMap = {
      blue: "group-hover:from-blue/15 group-hover:to-blue/10",
      green: "group-hover:from-green/15 group-hover:to-green/10",
      red: "group-hover:from-red/15 group-hover:to-red/10",
      orange: "group-hover:from-orange/15 group-hover:to-orange/10",
      yellow: "group-hover:from-yellow/15 group-hover:to-yellow/10",
    };
    return colorMap[color] || "";
  };

  const getTitleHoverColor = () => {
    const colorMap = {
      primary: "group-hover:text-primary",
      blue: "group-hover:text-blue",
      green: "group-hover:text-green",
      red: "group-hover:text-red",
      orange: "group-hover:text-orange",
      yellow: "group-hover:text-yellow",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getBorderColor = () => {
    const colorMap = {
      primary: "border-primary/40",
      blue: "border-blue/40",
      green: "border-green/40",
      red: "border-red/40",
      orange: "border-orange/40",
      yellow: "border-yellow/40",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getCornerAccent = () => {
    if (color === "primary") {
      return "bg-linear-to-tr from-primary/20 to-transparent group-hover:from-primary/25";
    }
    const colorMap: Record<
      "blue" | "green" | "red" | "orange" | "yellow",
      string
    > = {
      blue: "bg-linear-to-tr from-blue/20 to-transparent group-hover:from-blue/25",
      green:
        "bg-linear-to-tr from-green/20 to-transparent group-hover:from-green/25",
      red: "bg-linear-to-tr from-red/20 to-transparent group-hover:from-red/25",
      orange:
        "bg-linear-to-tr from-orange/20 to-transparent group-hover:from-orange/25",
      yellow:
        "bg-linear-to-tr from-yellow/20 to-transparent group-hover:from-yellow/25",
    };
    return (
      colorMap[color] ||
      "bg-linear-to-tr from-primary/20 to-transparent group-hover:from-primary/25"
    );
  };

  const getBottomAccent = () => {
    if (color === "primary") {
      return "bg-linear-to-r from-transparent via-primary/25 to-transparent group-hover:via-primary/50";
    }
    const colorMap: Record<
      "blue" | "green" | "red" | "orange" | "yellow",
      string
    > = {
      blue: "bg-linear-to-r from-transparent via-blue/25 to-transparent group-hover:via-blue/50",
      green:
        "bg-linear-to-r from-transparent via-green/25 to-transparent group-hover:via-green/50",
      red: "bg-linear-to-r from-transparent via-red/25 to-transparent group-hover:via-red/50",
      orange:
        "bg-linear-to-r from-transparent via-orange/25 to-transparent group-hover:via-orange/50",
      yellow:
        "bg-linear-to-r from-transparent via-yellow/25 to-transparent group-hover:via-yellow/50",
    };
    return (
      colorMap[color] ||
      "bg-linear-to-r from-transparent via-primary/25 to-transparent group-hover:via-primary/50"
    );
  };

  return (
    <div
      className={twMerge(
        "group relative flex flex-col items-start rounded-3xl overflow-hidden",
        "bg-linear-to-br from-dark via-dark/90 to-dark/80",
        getColorClasses(),
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-2",
        className,
      )}
    >
      {/* Gradient overlay - always visible like SellingPoints */}
      <div
        className={twMerge(
          "absolute inset-0 rounded-3xl opacity-100",
          getGradientOverlay(),
          "transition-opacity duration-300 ease-out",
          getHoverGradientOverlay(),
        )}
      />

      {/* Image at the top with fixed height */}
      {imageUrl && (
        <div className="relative z-10 w-full h-48 overflow-hidden">
          {/* Image overlay gradient */}
          <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-dark/40 pointer-events-none" />
          <figure className="relative w-full h-full">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src={imageUrl}
              alt={imageAlt || ""}
              fill={true}
            />
          </figure>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-col items-start gap-5 px-10 py-8 w-full flex-1">
        {/* Title */}
        {title && (
          <h3
            className={twMerge(
              "relative z-10 text-xl font-bold text-white leading-tight",
              "transition-colors duration-300",
              getTitleHoverColor(),
            )}
          >
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <div
            className={twMerge(
              "relative z-10 flex-1 text-white/90 leading-relaxed",
              "transition-colors duration-300",
            )}
          >
            {description}
          </div>
        )}

        {/* Children (e.g., buttons) */}
        {children && (
          <div className="relative z-10 w-full mt-auto">{children}</div>
        )}

        {/* Labels */}
        {(leftLabel || rightLabel) && (
          <div
            className={twMerge(
              "relative z-10 flex items-center justify-between w-full pt-4 mt-2 border-t",
              getBorderColor(),
            )}
          >
            {leftLabel && (
              <span className="text-sm font-medium text-white/80">
                {leftLabel}
              </span>
            )}
            {rightLabel && (
              <span className="text-sm font-medium text-white/80">
                {rightLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Decorative corner accent - always visible like SellingPoints */}
      <div
        className={twMerge(
          "absolute bottom-0 right-0 w-24 h-24",
          getCornerAccent(),
          "rounded-tl-full opacity-100",
          "transition-all duration-300 ease-out",
          "group-hover:w-28 group-hover:h-28",
        )}
      />

      {/* Bottom accent line - subtle by default, enhanced on hover */}
      <div
        className={twMerge(
          "absolute bottom-0 left-0 right-0 h-0.5",
          getBottomAccent(),
          "opacity-70",
          "transition-all duration-300 ease-out",
          "group-hover:opacity-100 group-hover:h-1",
        )}
      />
    </div>
  );
};

export default Card;
