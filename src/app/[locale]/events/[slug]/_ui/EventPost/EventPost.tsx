import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import type { LocaleOption, RawUrl, RichText } from "@/types";
import { getUrl } from "@/utils";
import { getGlobals } from "@/utils/server";
import EventsAside from "../EventsAside";
import EventPostClient from "./EventPostClient";

type EventPostProps = {
  eventPost: Config["collections"]["events-posts"];
  allEventsPosts: Config["collections"]["events-posts"][];
};

const EventPost = async ({ eventPost, allEventsPosts }: EventPostProps) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getGlobals(locale);

  // Rendered summary
  const renderedSummary = eventPost.summary ? (
    <RichTextRenderer richText={eventPost.summary as RichText} />
  ) : null;

  // Rendered content
  const renderedContent = eventPost.content ? (
    <RichTextRenderer richText={eventPost.content as RichText} />
  ) : null;

  // Button URL
  const buttonUrl =
    eventPost.showButton && eventPost.button
      ? getUrl(eventPost.button as RawUrl, globals)
      : undefined;

  // Filter other event posts for sidebar
  const otherEventsPosts = allEventsPosts.filter(
    (post) => post.slug !== eventPost.slug && post.slug && post.url,
  );

  return (
    <section className="flex justify-center w-full py-20">
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col justify-center items-center gap-20 w-11/12 max-w-5xl",
          "de:flex-row de:items-start de:gap-20",
        )}
      >
        {/* Event post */}
        <article className={twMerge("w-full", "de:w-3/5")}>
          <EventPostClient
            eventPost={{
              ...eventPost,
              renderedSummary: renderedSummary,
              renderedContent: renderedContent,
              buttonUrl: buttonUrl,
            }}
          />
        </article>

        {/* Other event posts */}
        <aside className={twMerge("flex flex-col gap-4 w-full", "de:w-2/5")}>
          <EventsAside eventsPosts={otherEventsPosts} />
        </aside>
      </div>
    </section>
  );
};

export default EventPost;
