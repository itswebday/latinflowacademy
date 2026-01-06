"use client";

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { BackgroundImage } from "@/components";
import type { Media } from "@/payload-types";

type DanceStylesPostClientProps = {
  landscapeImage: Media | null;
  name: string;
  title?: string | null;
  renderedContent: ReactNode | null;
  iframeUrl?: string | null;
};

const DanceStylesPostClient: React.FC<DanceStylesPostClientProps> = ({
  landscapeImage,
  name,
  title,
  renderedContent,
  iframeUrl,
}) => {
  const imageUrl = landscapeImage?.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || ""}${landscapeImage.url}`
    : "";
  const imageAlt = landscapeImage?.alt || name || "";

  return (
    <>
      {/* Header */}
      <header
        className={twMerge(
          "relative flex justify-center w-full mx-auto bg-dark",
          "h-[300px]",
          "de:h-[500px]",
        )}
      >
        {/* Background image */}
        {imageUrl && (
          <BackgroundImage
            className="object-top opacity-70"
            src={imageUrl}
            alt={imageAlt}
          />
        )}

        {/* Container */}
        <div
          className={twMerge(
            "z-10 flex flex-col justify-center items-center",
            "w-11/12 max-w-5xl text-center",
          )}
        >
          {/* Title */}
          {name && <h1 className="text-white font-semibold">{name}</h1>}
        </div>
      </header>

      {/* Description */}
      <section
        className={twMerge(
          "relative flex flex-col items-center gap-8 py-12 overflow-hidden",
          "de:pt-20",
        )}
      >
        {/* Container */}
        <div className={twMerge("flex flex-col gap-8 w-5/6 max-w-5xl")}>
          {/* Title */}
          {title && <h2>{title}</h2>}

          {/* Description */}
          {renderedContent && (
            <div className="w-full max-w-3xl">{renderedContent}</div>
          )}
        </div>
      </section>

      {/* Aside */}
      {iframeUrl && (
        <aside className="flex justify-center w-full">
          <iframe
            className={twMerge("w-11/12 max-w-5xl h-[500px] rounded-lg")}
            src={iframeUrl}
          />
        </aside>
      )}
    </>
  );
};

export default DanceStylesPostClient;
