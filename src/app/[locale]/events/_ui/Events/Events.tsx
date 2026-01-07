import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import { HeadingWithIcon } from "@/components";
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
    <section className="relative flex justify-center w-full py-20">
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col items-center gap-4",
          "w-11/12 max-w-7xl mx-auto",
        )}
      >
        {/* Heading */}
        <HeadingWithIcon icon={events.heading.icon}>
          <h1 className="font-bold">{events.heading.text}</h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-2xl mx-auto text-dark/70 text-center">
          {events.paragraph.text}
        </p>

        {/* Event posts and other event posts */}
        <div
          className={twMerge(
            "flex flex-col gap-4 w-full",
            "de:flex-row de:gap-20",
          )}
        >
          {/* Event posts */}
          <div className={twMerge("w-full", "de:w-3/5")}>
            {eventsPosts.length === 0 ? (
              <p className="my-16 text-dark/60 text-center">
                {eventsT("noPosts")}
              </p>
            ) : (
              <EventsClient
                className="mt-16"
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
          <aside className="w-full mt-16 de:w-2/5">
            <EventsAside eventsPosts={allEventsPosts} />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Events;
