"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { ButtonLink } from "@/components";
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
    <nav className={twMerge("flex flex-col gap-6", className)}>
      {/* Heading */}
      <header>
        <h3>{eventsT("otherPosts.heading")}</h3>
      </header>

      {/* List */}
      <div className="flex flex-col gap-2">
        {eventsPosts.map((post, index) => {
          const url = post.url || "#";

          return (
            <ButtonLink key={index} variant="transparentButton" href={url}>
              {post.title}
            </ButtonLink>
          );
        })}
      </div>
    </nav>
  );
};

export default EventsAside;
