"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavLink } from "@/components";
import { createLinkClickHandler } from "@/utils";
import NavBarDropdownArrow from "./NavBarDropdownArrow";
import NavBarDropdownMenu from "./NavBarDropdownMenu";

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

  // Container attributes
  const attributes = {
    className: `
      relative flex items-center h-full px-nav-link text-white
      hover:text-primary
      ${isClicked ? "opacity-50 pointer-events-none" : ""}
      ${className}
    `,
  };

  // Text and dropdown arrow
  const children = (
    <div
      className={`
        flex items-center gap-1 h-full transition-colors duration-200
        ${className}
      `}
      onClick={handleClick}
    >
      {text}
      <NavBarDropdownArrow isHovered={isHovered} />
    </div>
  );

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link or not depending on href */}
      {href && clickable ? (
        <Link href={href} target={newTab ? "_blank" : "_self"} {...attributes}>
          {children}
        </Link>
      ) : (
        <div {...attributes}>{children}</div>
      )}

      {/* Dropdown menu */}
      {isHovered && (
        <NavBarDropdownMenu className={className} subLinks={subLinks} />
      )}
    </div>
  );
};

export default NavBarDropdownLink;
