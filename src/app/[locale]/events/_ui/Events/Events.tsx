import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import { processText } from "@/utils";
import type { Config } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getCollection } from "@/utils/server";
import EventsAside from "../../[slug]/_ui/EventsAside";
import EventsClient from "./EventsClient";

type EventsProps = {
  events: Config["globals"]["events"];
  eventsPosts: Config["collections"]["events-posts"][];
};

const Events: React.FC<EventsProps> = async ({ events, eventsPosts }) => {
  const locale = (await getLocale()) as LocaleOption;
  const eventsT = await getTranslations("events");

  // Filter other event posts for sidebar
  const allEventsPosts = await getCollection("events-posts", locale, {
    sort: { field: "date", direction: "asc" },
    filters: [{ field: "_status", operator: "equals", value: "published" }],
    depth: 1,
  });

  return (
    <section className="relative flex justify-center w-full pt-40 pb-20 bg-dark">
      {/* Container */}
      <div
        className={twMerge(
          "relative z-10 flex flex-col items-center gap-6",
          "w-11/12 max-w-400 mx-auto",
        )}
      >
        {/* Heading */}
        <AnimatedWrapper delay={0} direction="up">
          <div className="relative w-full pb-4">
            <HeadingWithIcon
              icon={events.heading.icon}
              className="justify-center text-center"
            >
              <h1
                className={twMerge(
                  "relative font-bold text-center",
                  "text-[48px] de:text-[64px]",
                  "leading-tight tracking-tight",
                  "bg-linear-to-r from-primary via-secondary to-primary",
                  "bg-clip-text text-transparent",
                  "bg-size-[200%_auto]",
                  "animate-[gradient_3s_ease_infinite]",
                  "drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]",
                  "drop-shadow-[0_0_60px_rgba(162,54,219,0.3)]",
                )}
              >
                {processText(events.heading.text)}
              </h1>
            </HeadingWithIcon>

            {/* Stripe below */}
            <div
              className={twMerge(
                "absolute bottom-0 left-1/2 -translate-x-1/2",
                "w-32 h-1 rounded-full",
                "bg-linear-to-r from-transparent via-primary to-transparent",
                "opacity-60",
              )}
              aria-hidden="true"
            />
          </div>
        </AnimatedWrapper>

        {/* Paragraph */}
        <AnimatedWrapper delay={0.1} direction="up">
          <div
            className={twMerge(
              "max-w-3xl mx-auto text-center",
              "text-white/90",
              "leading-relaxed tracking-wide",
              "px-4",
            )}
          >
            {processText(events.paragraph.text)}
          </div>
        </AnimatedWrapper>

        {/* Event posts and other event posts */}
        <div
          className={twMerge(
            "flex flex-col gap-8 w-full mt-6",
            "de:flex-row de:gap-6",
          )}
        >
          {/* Event posts */}
          <div className={twMerge("w-full", "de:w-3/5")}>
            {eventsPosts.length === 0 ? (
              <AnimatedWrapper delay={0.2} direction="up">
                <p className="my-16 text-white/60 text-center">
                  {eventsT("noPosts")}
                </p>
              </AnimatedWrapper>
            ) : (
              <EventsClient
                eventsPosts={eventsPosts
                  .filter((post) => post.url && post.slug)
                  .map((post) => ({
                    ...post,
                    renderedSummary: post.summary ? (
                      <RichTextRenderer richText={post.summary as RichText} />
                    ) : null,
                  }))}
              />
            )}
          </div>

          {/* Other event items */}
          <aside className={twMerge("w-full", "de:w-2/5")}>
            <EventsAside eventsPosts={allEventsPosts} />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Events;
