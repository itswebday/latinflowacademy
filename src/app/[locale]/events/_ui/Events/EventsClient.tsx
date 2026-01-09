"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, ButtonLink } from "@/components";
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
    <div className={twMerge("flex flex-col gap-16", className)}>
      {eventsPosts.map((post, index) => {
        const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(post.image);
        const url = post.url || "#";

        return (
          <AnimatedWrapper
            key={post.id}
            delay={0.2 + index * 0.1}
            direction="up"
          >
            <article
              className={twMerge(
                "relative flex flex-col gap-6 p-8",
                "bg-white/5 backdrop-blur-sm rounded-3xl",
                "border border-white/10",
                "transition-all duration-300",
                "hover:bg-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20",
              )}
            >
              {/* Decorative gradient overlay */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(162, 54, 219, 0.1) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-6">
                {/* Title */}
                <header>
                  <h4 className="font-bold text-white text-[24px]">
                    {post.title}
                  </h4>
                </header>

                {/* Image */}
                {imageUrl && (
                  <figure
                    className={twMerge(
                      "relative w-full aspect-square rounded-2xl overflow-hidden",
                      "border-2 border-white/20",
                      "transition-transform duration-300 hover:scale-[1.02]",
                    )}
                  >
                    <Image
                      className="object-cover"
                      src={imageUrl}
                      alt={imageAlt}
                      fill={true}
                      sizes="(max-width: 900px) 100vw, 768px"
                      priority={index === 0}
                    />
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-dark/40 to-transparent pointer-events-none" />
                  </figure>
                )}

                {/* Summary */}
                {post.renderedSummary && (
                  <div className="text-white/80 text-[16px]">
                    {post.renderedSummary}
                  </div>
                )}

                {/* Read more button */}
                <ButtonLink
                  className="w-fit mt-2"
                  variant="transparentButton"
                  href={url}
                >
                  {eventsT("readMore")}
                </ButtonLink>
              </div>
            </article>
          </AnimatedWrapper>
        );
      })}
    </div>
  );
};

export default EventsClient;
