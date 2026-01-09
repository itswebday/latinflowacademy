"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, ButtonLink } from "@/components";
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
    <article
      className={twMerge(
        "relative flex flex-col gap-8 p-8",
        "bg-white/5 backdrop-blur-sm rounded-3xl",
        "border border-white/10",
        "transition-all duration-300",
        "hover:bg-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20",
        className,
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
      <div className="relative z-10 flex flex-col gap-8">
        {/* Title */}
        <AnimatedWrapper delay={0} direction="up">
          <header>
            <h1 className="font-bold text-white text-[36px] de:text-[48px]">
              {eventPost.title}
            </h1>
          </header>
        </AnimatedWrapper>

        {/* Image */}
        {imageUrl && (
          <AnimatedWrapper delay={0.1} direction="up">
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
                priority={true}
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-dark/40 to-transparent pointer-events-none" />
            </figure>
          </AnimatedWrapper>
        )}

        {/* Summary */}
        {eventPost.renderedSummary && (
          <AnimatedWrapper delay={0.2} direction="up">
            <div className="text-white/80 text-[16px]">
              {eventPost.renderedSummary}
            </div>
          </AnimatedWrapper>
        )}

        {/* Content */}
        {eventPost.renderedContent && (
          <AnimatedWrapper delay={0.3} direction="up">
            <div className="text-white/90 text-[16px]">
              {eventPost.renderedContent}
            </div>
          </AnimatedWrapper>
        )}

        {/* Button */}
        {eventPost.showButton && eventPost.button && eventPost.buttonUrl && (
          <AnimatedWrapper delay={0.4} direction="up">
            <div className="w-fit mt-2">
              <ButtonLink
                variant={eventPost.button.variant}
                href={eventPost.buttonUrl}
                target={eventPost.button.newTab ? "_blank" : "_self"}
              >
                {eventPost.button.text}
              </ButtonLink>
            </div>
          </AnimatedWrapper>
        )}
      </div>
    </article>
  );
};

export default EventPostClient;
