"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { createLinkClickHandler } from "@/utils";

export type FooterLinkProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
};

const FooterLink: React.FC<FooterLinkProps> = ({
  children,
  className,
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

  return href ? (
    <Link
      className={twMerge(
        "flex items-center py-0.5",
        "transition-opacity duration-200 hover:opacity-80",
        isClicked && "pointer-events-none",
        className,
      )}
      href={href}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      target={target}
      prefetch={false}
      onClick={handleClick}
    >
      {children}
    </Link>
  ) : (
    <div
      className={twMerge(
        "flex items-center py-0.5",
        "transition-opacity duration-200 hover:opacity-80",
        isClicked && "pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FooterLink;
