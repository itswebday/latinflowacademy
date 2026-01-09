"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, ButtonLink } from "@/components";
import type { Config } from "@/payload-types";

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
        "relative flex flex-col gap-6 p-8",
        "bg-white/5 backdrop-blur-sm rounded-3xl",
        "border border-white/10",
        className,
      )}
    >
      {/* Decorative gradient overlay */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(162, 54, 219, 0.05) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Heading */}
        <AnimatedWrapper delay={0.2} direction="up">
          <header>
            <h3 className="font-bold text-white text-[24px]">
              {eventsT("otherPosts.heading")}
            </h3>
          </header>
        </AnimatedWrapper>

        {/* List */}
        <div className="flex flex-col gap-3">
          {eventsPosts.map((post, index) => {
            const url = post.url || "#";

            return (
              <AnimatedWrapper
                key={index}
                delay={0.3 + index * 0.05}
                direction="up"
              >
                <ButtonLink
                  className={twMerge(
                    "text-left text-white/80",
                    "transition-colors duration-300",
                    "hover:text-white hover:bg-white/5",
                    "rounded-lg px-4 py-2",
                  )}
                  variant="transparentButton"
                  href={url}
                >
                  {post.title}
                </ButtonLink>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default EventsAside;
