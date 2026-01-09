"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import { ChevronDown } from "@/components/icons";
import { createLinkClickHandler } from "@/utils";

export type NavBarDropdownLinkProps = {
  className?: string;
  text: string;
  href?: string;
  newTab?: boolean;
  subLinks: { text: string; href: string; newTab: boolean }[];
  clickable?: boolean;
  onClick?: () => void;
};

const NavBarDropdownLink: React.FC<NavBarDropdownLinkProps> = ({
  className,
  text,
  href,
  newTab,
  subLinks,
  clickable = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (href && clickable) {
      const linkHandler = createLinkClickHandler(href, pathname, {
        onNavigate: () => {
          setIsClicked(true);
          setTimeout(() => setIsClicked(false), 1000);
        },
        onClick,
      });

      linkHandler(e);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={twMerge(
        "relative h-full",
        isClicked && "pointer-events-none",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link */}
      <NavLink
        className="h-full"
        href={clickable ? href : undefined}
        target={newTab ? "_blank" : "_self"}
      >
        {/* Text and dropdown arrow */}
        <div className="flex items-center gap-2 h-full" onClick={handleClick}>
          {/* Text */}
          <span
            className={twMerge(
              "text-[15px] text-white font-semibold",
              "transition-colors duration-200",
              isHovered && "text-primary",
            )}
          >
            {text}
          </span>

          {/* Dropdown arrow */}
          <div
            className={twMerge(
              "flex items-center transition-transform duration-200",
              isHovered && "rotate-180",
            )}
          >
            <ChevronDown
              className={twMerge(
                "w-4 h-4 text-white/70 transition-colors duration-200",
                isHovered && "text-primary",
              )}
            />
          </div>
        </div>
      </NavLink>

      {/* Dropdown list */}
      <AnimatePresence>
        {isHovered && subLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className={twMerge(
              "z-95 absolute -left-2 top-full flex flex-col w-56",
              "rounded-lg bg-white shadow-lg",
              "border border-gray-200 overflow-hidden",
            )}
          >
            {/* Sublinks */}
            {subLinks.map((subLink, index) => (
              <NavLink
                key={index}
                className={twMerge(
                  "block px-5 py-3",
                  "transition-colors duration-200",
                  "hover:bg-gray-100",
                )}
                href={subLink.href}
                target={subLink.newTab ? "_blank" : "_self"}
              >
                <span className="text-[14px] text-dark/80 font-medium">
                  {subLink.text}
                </span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBarDropdownLink;
