"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Media } from "@/payload-types";

type TeachersPostClientProps = {
  className?: string;
  image: Media | null;
  name: string;
  renderedContent: ReactNode | null;
};

const TeachersPostClient: React.FC<TeachersPostClientProps> = ({
  className,
  image,
  name,
  renderedContent,
}) => {
  const imageUrl = image?.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || ""}${image.url}`
    : "";
  const imageAlt = image?.alt || name || "";

  return (
    <div
      className={twMerge(
        "relative flex justify-between items-center w-full",
        "flex-col-reverse gap-12",
        "de:flex-row de:items-start de:gap-0",
        className,
      )}
    >
      {/* Text container */}
      <div className={twMerge("flex flex-col gap-8 w-11/12", "de:w-[60%]")}>
        {/* Title */}
        <h1 className="text-center de:text-left">{name}</h1>

        {/* Description */}
        {renderedContent}
      </div>

      {/* Image container */}
      {imageUrl && (
        <figure
          className={twMerge(
            "relative w-72 h-72",
            "drop-shadow-[5px_5px_3px_rgba(136,136,136,0.5)]",
          )}
        >
          <Image
            className="object-cover"
            src={imageUrl}
            alt={imageAlt}
            width={288}
            height={288}
            loading="eager"
          />
        </figure>
      )}
    </div>
  );
};

export default TeachersPostClient;
