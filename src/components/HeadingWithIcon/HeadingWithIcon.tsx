"use client";

import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getMediaUrlAndAlt } from "@/utils";

type HeadingWithIconProps = {
  children: React.ReactNode;
  className?: string;
  icon?: number | { id?: number | null; url?: string | null } | null;
};

const HeadingWithIcon: React.FC<HeadingWithIconProps> = ({
  children,
  className,
  icon,
}) => {
  const { url: iconUrl, alt: iconAlt } = icon
    ? getMediaUrlAndAlt(icon)
    : { url: undefined, alt: undefined };

  return (
    <header className={twMerge("flex items-center gap-3", className)}>
      {iconUrl && (
        <span className="relative shrink-0 h-5 w-5">
          <Image
            className="object-contain"
            src={iconUrl}
            alt={iconAlt || ""}
            fill={true}
            sizes="20px"
          />
        </span>
      )}

      {children}
    </header>
  );
};

export default HeadingWithIcon;
