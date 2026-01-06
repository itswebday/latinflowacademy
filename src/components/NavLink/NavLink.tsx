"use client";

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
  const pathname = usePathname();

  const handleClick = createLinkClickHandler(href, pathname, {
    onNavigate: () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 1000);
    },
    onClick,
  });

  const attributes = {
    className: `
      flex items-center px-nav-link text-white
      transition-colors duration-200 hover:text-primary
      ${isClicked ? "opacity-50 pointer-events-none" : ""}
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
      {children}
    </Link>
  ) : (
    <div {...attributes}>{children}</div>
  );
};

export default NavLink;
