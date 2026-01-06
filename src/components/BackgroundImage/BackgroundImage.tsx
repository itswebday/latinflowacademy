"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";

type BackgroundImageProps = {
  className?: string;
  src: string;
  alt: string;
  priority?: boolean;
};

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  className,
  src,
  alt,
  priority = true,
}) => {
  // Extract object positioning classes
  const objectPositionClasses = className
    ? className
        .split(" ")
        .filter((cls) => cls.startsWith("object-"))
        .join(" ")
    : "";

  // Remove object positioning classes from figure
  const figureClassName = className
    ? className
        .split(" ")
        .filter((cls) => !cls.startsWith("object-"))
        .join(" ")
    : "";

  return (
    <figure className={twMerge("absolute inset-0 z-0", figureClassName)}>
      <Image
        className={twMerge("object-cover", objectPositionClasses)}
        src={src}
        alt={alt}
        fill={true}
        sizes="100vw"
        priority={priority}
      />
    </figure>
  );
};

export default BackgroundImage;
