"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonLink } from "@/components";
import type { Config } from "@/payload-types";
import { getMediaUrlAndAlt } from "@/utils";

type EventPostClientProps = {
  className?: string;
  eventPost: Config["collections"]["events-posts"] & {
    renderedSummary: ReactNode;
    renderedContent: ReactNode;
    buttonUrl?: string;
  };
};

const EventPostClient: React.FC<EventPostClientProps> = ({
  className,
  eventPost,
}) => {
  const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(eventPost.image);

  return (
    <article className={twMerge("flex flex-col gap-4", className)}>
      {/* Title */}
      <header>
        <h2>{eventPost.title}</h2>
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
      {eventPost.renderedSummary}

      {/* Content */}
      {eventPost.renderedContent}

      {/* Button */}
      {eventPost.showButton && eventPost.button && eventPost.buttonUrl && (
        <div className="w-fit">
          <ButtonLink
            variant={eventPost.button.variant}
            href={eventPost.buttonUrl}
            target={eventPost.button.newTab ? "_blank" : "_self"}
          >
            {eventPost.button.text}
          </ButtonLink>
        </div>
      )}
    </article>
  );
};

export default EventPostClient;
