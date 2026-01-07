"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createLinkClickHandler } from "@/utils";

export type NavLinkProps = {
  className?: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
};

const NavLink: React.FC<NavLinkProps> = ({
  className,
  children,
  href,
  target = "_self",
  onClick,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const handleClick = createLinkClickHandler(href, pathname, {
    onNavigate: () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 1000);
    },
    onClick,
  });

  const content = (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Underline animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
      {children}
    </motion.div>
  );

  const attributes = {
    className: `
      flex items-center py-2
      ${isClicked && "pointer-events-none"}
      ${className}
    `,
    onClick: handleClick,
  };

  return href ? (
    <Link
      {...attributes}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      prefetch={true}
    >
      {content}
    </Link>
  ) : (
    <div {...attributes}>{content}</div>
  );
};

export default NavLink;
