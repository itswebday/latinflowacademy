import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import {
  getCachedCollection,
  getCachedGlobal,
  getCollection,
  getGlobal,
  getMetadata,
} from "@/utils/server";
import { Events } from "./_ui";

const EventsPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const events = draft.isEnabled
    ? await getGlobal("events", locale)
    : await getCachedGlobal("events", locale)();
  const eventsPosts = draft.isEnabled
    ? await getCollection("events-posts", locale, {
        sort: { field: "date", direction: "asc" },
        filters: [
          { field: "_status", operator: "equals", value: "published" },
          {
            field: "date",
            operator: "greater_than",
            value: new Date().toISOString(),
          },
        ],
        depth: 1,
      })
    : await getCachedCollection("events-posts", locale, {
        sort: { field: "date", direction: "asc" },
        filters: [
          { field: "_status", operator: "equals", value: "published" },
          {
            field: "date",
            operator: "greater_than",
            value: new Date().toISOString(),
          },
        ],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="events">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Events events={events} eventsPosts={eventsPosts} />
      </main>
    </PageWrapper>
  );
};

export default EventsPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the events page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const events = await getCachedGlobal("events", locale)();
  const eventsT = await getTranslations("events");
  const metadata = await getMetadata({ doc: events, locale });

  // Fallback to events title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: eventsT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: eventsT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
