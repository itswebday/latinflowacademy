"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, BackgroundImage } from "@/components";
import type { Config } from "@/payload-types";
import { getMediaUrlAndAlt } from "@/utils";

type EventsAsideProps = {
  className?: string;
  eventsPosts: Config["collections"]["events-posts"][];
};

const EventsAside: React.FC<EventsAsideProps> = ({
  className,
  eventsPosts,
}) => {
  const eventsT = useTranslations("events");

  if (eventsPosts.length === 0) {
    return null;
  }

  return (
    <nav
      className={twMerge(
        "group relative flex flex-col gap-6 overflow-hidden rounded-4xl",
        "bg-linear-to-br from-dark via-dark/95 to-dark/90",
        "border backdrop-blur-sm",
        "shadow-xl transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:border-primary/30",
        "border-white/10",
        "pl-10 pt-10 pr-8 pb-12",
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
      <div className="relative z-10 flex flex-col gap-6">
        {/* Heading */}
        <AnimatedWrapper delay={0.2} direction="up">
          <header>
            <h3
              className={twMerge(
                "font-bold text-white",
                "text-[24px] de:text-[28px]",
                "leading-tight",
              )}
            >
              {eventsT("otherPosts.heading")}
            </h3>
          </header>
        </AnimatedWrapper>

        {/* List */}
        <div className="flex flex-col gap-3">
          {eventsPosts.map((post, index) => {
            const url = post.url || "#";
            const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(
              post.image,
            );

            return (
              <AnimatedWrapper
                key={index}
                delay={0.3 + index * 0.05}
                direction="up"
              >
                <Link
                  className={twMerge(
                    "group/item relative w-full overflow-hidden",
                    "flex items-center",
                    "h-32 rounded-xl",
                    "transition-all duration-300 ease-out",
                    "hover:shadow-lg hover:shadow-primary/20",
                  )}
                  href={url}
                >
                  {/* Background image */}
                  {imageUrl && (
                    <>
                      <BackgroundImage
                        className={twMerge(
                          "opacity-80 transition-all duration-300 ease-out",
                          "group-hover/item:scale-110 group-hover/item:opacity-100",
                        )}
                        src={imageUrl}
                        alt={imageAlt}
                      />
                      {/* Dark overlay for text readability */}
                      <div
                        className={twMerge(
                          "absolute inset-0 z-1",
                          "bg-linear-to-r from-dark/95 via-dark/85 to-dark/75",
                          "opacity-0 transition-opacity duration-300 ease-out",
                          "group-hover/item:opacity-100",
                        )}
                      />
                    </>
                  )}

                  {/* Text overlay */}
                  <div
                    className={twMerge(
                      "relative z-2 w-full flex items-center justify-center px-4",
                      "opacity-0 transition-all duration-300 ease-out",
                      "group-hover/item:opacity-100",
                    )}
                  >
                    <span
                      className={twMerge(
                        "block text-white text-center",
                        "text-[18px] font-bold",
                        "leading-snug",
                        "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]",
                        "drop-shadow-[0_0_16px_rgba(0,0,0,0.6)]",
                        "transition-all duration-300 ease-out",
                        "group-hover/item:text-[20px]",
                      )}
                    >
                      {post.title}
                    </span>
                  </div>
                </Link>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default EventsAside;
