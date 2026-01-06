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
  variant?: "primaryButton" | "greenLink" | "grayLink" | "underlineLink";
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
          "px-6 py-3 text-white bg-primary rounded-sm",
          "hover:scale-105 hover:text-darkgreen",
        );
      case "greenLink":
        return "text-primary hover:text-darkgreen";
      case "grayLink":
        return "flex-row-reverse text-gray hover:text-primary";
      case "underlineLink":
        return "text-gray underline hover:text-primary";
      default:
        return "text-gray underline hover:text-primary";
    }
  };

  return (
    <Link
      className={twMerge(
        "relative flex items-center gap-2 w-fit font-semibold",
        "transition duration-200",
        getVariantStyles(),
        isClicked && "opacity-50 pointer-events-none",
        className,
      )}
      href={href}
      prefetch={true}
      target={target}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Button animation */}
      {variant === "primaryButton" && (
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, " +
              "rgba(255,255,255,0) 100%)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {/* Clicked animation */}
      {isClicked && variant === "primaryButton" && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-sm"
          animate={{ opacity: 0, scale: 2.5 }}
          initial={{ opacity: 0.6, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Button text */}
      <span className="z-10 relative text-[15px]">{children}</span>

      {/* Arrow */}
      {variant && (
        <span className="z-10 relative">
          <ChevronRight className="relative w-4 h-4" />
        </span>
      )}
    </Link>
  );
};

export default ButtonLink;
