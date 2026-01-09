"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronRight } from "@/components/icons";
import { createLinkClickHandler } from "@/utils";

export type ButtonLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  variant?:
    | "primaryButton"
    | "whiteButton"
    | "darkButton"
    | "transparentButton";
  target?: "_blank" | "_self";
  onClick?: () => void;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  className,
  variant,
  href,
  target = "_self",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pathname = usePathname();

  const handleClick = createLinkClickHandler(href, pathname, {
    onNavigate: () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 1000);
    },
    onClick,
  });

  const getVariantStyles = () => {
    switch (variant) {
      case "primaryButton":
        return twMerge(
          "text-white bg-linear-to-r from-primary to-secondary",
          "rounded-full shadow-lg shadow-primary/30",
          "hover:scale-105 hover:shadow-xl hover:shadow-primary/40",
          "transition-all duration-300",
        );
      case "whiteButton":
        return twMerge(
          "text-dark bg-white rounded-full shadow-lg shadow-dark/10",
          "hover:scale-105 hover:shadow-xl hover:shadow-dark/20",
          "border-2 border-white/50",
          "transition-all duration-300",
        );
      case "darkButton":
        return twMerge(
          "text-white bg-dark rounded-full shadow-lg shadow-dark/50",
          "border-2 border-dark/80 transition-all duration-300",
          "hover:scale-105 hover:shadow-xl hover:shadow-dark/70",
        );
      case "transparentButton":
        return twMerge(
          "text-white bg-transparent rounded-full border-2 border-white/30",
          "backdrop-blur-sm transition-all duration-300",
          "hover:scale-105 hover:border-white/60 hover:bg-white/5",
        );
      default:
        return "";
    }
  };

  return (
    <Link
      className={twMerge(
        "relative flex items-center gap-3 w-fit pl-8 pr-6 py-4 font-semibold",
        "overflow-hidden",
        getVariantStyles(),
        isClicked && "opacity-70 pointer-events-none",
        className,
      )}
      href={href}
      prefetch={true}
      target={target}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover shine effect */}
      {(variant === "primaryButton" ||
        variant === "whiteButton" ||
        variant === "darkButton" ||
        variant === "transparentButton") && (
        <motion.div
          className="absolute inset-0 opacity-0 rounded-full"
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, " +
              "rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 100%)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}

      {/* Ripple effect on click */}
      {isClicked &&
        (variant === "primaryButton" ||
          variant === "whiteButton" ||
          variant === "darkButton" ||
          variant === "transparentButton") && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                variant === "primaryButton"
                  ? "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)"
                  : variant === "whiteButton"
                    ? "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)"
                    : variant === "darkButton"
                      ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            }}
            animate={{ opacity: 0, scale: 2.5 }}
            initial={{ opacity: 0.8, scale: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

      {/* Button text */}
      <span className="z-10 relative -translate-y-[0.5px] uppercase">
        {children}
      </span>

      {/* Arrow with animation */}
      {variant && (
        <motion.span
          className="z-10 relative"
          animate={{
            x: isHovered ? 4 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronRight className="relative w-5 h-5 -translate-y-[0.5px]" />
        </motion.span>
      )}
    </Link>
  );
};

export default ButtonLink;
