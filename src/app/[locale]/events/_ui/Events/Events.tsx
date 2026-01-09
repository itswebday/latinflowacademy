import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
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
    <section className="relative flex justify-center w-full py-32 bg-dark">
      {/* Container */}
      <div
        className={twMerge(
          "relative z-10 flex flex-col items-center gap-8",
          "w-11/12 max-w-7xl mx-auto",
          "de:gap-12",
        )}
      >
        {/* Heading */}
        <AnimatedWrapper delay={0} direction="up">
          <HeadingWithIcon icon={events.heading.icon}>
            <h1 className="font-bold text-white text-center">
              {events.heading.text}
            </h1>
          </HeadingWithIcon>
        </AnimatedWrapper>

        {/* Paragraph */}
        <AnimatedWrapper delay={0.1} direction="up">
          <p className="max-w-2xl mx-auto text-white/80 text-center text-[16px]">
            {events.paragraph.text}
          </p>
        </AnimatedWrapper>

        {/* Event posts and other event posts */}
        <div
          className={twMerge(
            "flex flex-col gap-8 w-full mt-8",
            "de:flex-row de:gap-20 de:mt-12",
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
                className="mt-8"
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
          <aside className="w-full mt-8 de:w-2/5 de:mt-0">
            <EventsAside eventsPosts={allEventsPosts} />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Events;
