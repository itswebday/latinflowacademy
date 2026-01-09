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
}) => {
  return (
    <div
      className={twMerge(
        "group relative flex flex-col items-start rounded-3xl overflow-hidden",
        "bg-linear-to-br from-dark via-dark/90 to-dark/80",
        "border border-primary/40",
        "shadow-xl shadow-primary/20",
        "transition-all duration-300 ease-out",
        "hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/30",
        "hover:scale-[1.02] hover:-translate-y-2",
        className,
      )}
    >
      {/* Gradient overlay - always visible like SellingPoints */}
      <div
        className={twMerge(
          "absolute inset-0 rounded-3xl opacity-100",
          "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
          "transition-opacity duration-300 ease-out",
          "group-hover:from-primary/15 group-hover:to-secondary/15",
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
              "group-hover:text-primary",
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
          <div className="relative z-10 flex items-center justify-between w-full pt-4 mt-2 border-t border-primary/40">
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
          "bg-linear-to-tr from-primary/20 to-transparent",
          "rounded-tl-full opacity-100",
          "transition-all duration-300 ease-out",
          "group-hover:w-28 group-hover:h-28 group-hover:from-primary/25",
        )}
      />

      {/* Bottom accent line - subtle by default, enhanced on hover */}
      <div
        className={twMerge(
          "absolute bottom-0 left-0 right-0 h-0.5",
          "bg-linear-to-r from-transparent via-primary/25 to-transparent",
          "opacity-70",
          "transition-all duration-300 ease-out",
          "group-hover:opacity-100 group-hover:via-primary/50 group-hover:h-1",
        )}
      />
    </div>
  );
};

export default Card;
