"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { ButtonLink } from "@/components";
import type { Config } from "@/payload-types";
import { getMediaUrlAndAlt } from "@/utils";

type EventsClientProps = {
  className?: string;
  eventsPosts: (Config["collections"]["events-posts"] & {
    renderedSummary: ReactNode;
  })[];
};

const EventsClient: React.FC<EventsClientProps> = ({
  className,
  eventsPosts,
}) => {
  const eventsT = useTranslations("events");

  return (
    <div className={twMerge("flex flex-col gap-20", className)}>
      {eventsPosts.map((post) => {
        const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(post.image);
        const url = post.url || "#";

        return (
          <article key={post.id} className={twMerge("flex flex-col gap-4")}>
            {/* Title */}
            <header>
              <h4 className="font-bold text-dark">{post.title}</h4>
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
            {post.renderedSummary}

            {/* Read more button */}
            <ButtonLink
              className="w-fit"
              variant="transparentButton"
              href={url}
            >
              {eventsT("readMore")}
            </ButtonLink>
          </article>
        );
      })}
    </div>
  );
};

export default EventsClient;
