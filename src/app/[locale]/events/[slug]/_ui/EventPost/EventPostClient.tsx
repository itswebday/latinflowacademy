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
        "group relative flex flex-col gap-8 overflow-hidden rounded-4xl",
        "bg-linear-to-br from-dark via-dark/95 to-dark/90",
        "border backdrop-blur-sm",
        "shadow-xl transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:border-primary/30",
        "border-white/10",
        className,
      )}
    >
      {/* Gradient overlay */}
      <div
        className={twMerge(
          "absolute inset-0 rounded-4xl",
          "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
          "transition-opacity duration-300 ease-out",
          "group-hover:opacity-100",
        )}
      />

      {/* Decorative corner accent */}
      <div
        className={twMerge(
          "absolute bottom-0 right-0 w-32 h-32",
          "bg-linear-to-tr from-primary/15 to-transparent",
          "rounded-tl-full",
          "transition-all duration-300 ease-out",
          "group-hover:w-36 group-hover:h-36 group-hover:from-primary/20",
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-8 pl-10 pt-14 pr-8 pb-12">
        {/* Title */}
        <AnimatedWrapper delay={0} direction="up">
          <header>
            <h1
              className={twMerge(
                "font-bold text-white",
                "text-[36px] de:text-[48px]",
                "leading-tight",
              )}
            >
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
