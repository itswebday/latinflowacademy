"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonLink } from "@/components";
import type { Config } from "@/payload-types";
import { getMediaUrlAndAlt } from "@/utils";

type NewsPostClientProps = {
  className?: string;
  newsPost: Config["collections"]["news-posts"] & {
    renderedSummary: ReactNode;
    renderedContent: ReactNode;
    buttonUrl?: string;
  };
};

const NewsPostClient: React.FC<NewsPostClientProps> = ({
  className,
  newsPost,
}) => {
  const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(newsPost.image);

  return (
    <article className={twMerge("flex flex-col gap-4", className)}>
      {/* Title */}
      <header>
        <h2>{newsPost.title}</h2>
      </header>

      {/* Image */}
      {imageUrl && (
        <figure
          className={twMerge(
            "relative w-full aspect-square rounded-lg overflow-hidden",
          )}
        >
          <Image
            className="object-cover"
            src={imageUrl}
            alt={imageAlt}
            fill={true}
            sizes="(max-width: 900px) 100vw, 768px"
            priority={true}
          />
        </figure>
      )}

      {/* Summary */}
      {newsPost.renderedSummary}

      {/* Content */}
      {newsPost.renderedContent}

      {/* Button */}
      {newsPost.showButton && newsPost.button && newsPost.buttonUrl && (
        <div className="w-fit">
          <ButtonLink
            variant={newsPost.button.variant}
            href={newsPost.buttonUrl}
            target={newsPost.button.newTab ? "_blank" : "_self"}
          >
            {newsPost.button.text}
          </ButtonLink>
        </div>
      )}
    </article>
  );
};

export default NewsPostClient;
