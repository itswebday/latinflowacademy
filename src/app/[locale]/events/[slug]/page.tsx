import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Config } from "@/payload-types";
import { getCachedPayload } from "@/utils/payload";
import type { LocaleOption } from "@/types";
import {
  getCachedCollection,
  getCachedDocument,
  getCollection,
  getDocument,
  getMetadata,
} from "@/utils/server";
import { EventPost } from "./_ui";

type EventPostPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const EventPostPage = async ({ params }: EventPostPageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const eventsT = await getTranslations("events");

  if (!LOCALES.includes(locale as LocaleOption)) {
    redirect(eventsT("url"));
  }

  const draft = await draftMode();
  const eventPost = draft.isEnabled
    ? ((await getDocument(
        "events-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )) as Config["collections"]["events-posts"] | null)
    : await getCachedDocument(
        "events-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )();

  if (!eventPost) {
    redirect(eventsT("url"));
  }

  if (!draft.isEnabled && eventPost._status !== "published") {
    redirect(eventsT("url"));
  }

  const allEventsPosts = draft.isEnabled
    ? await getCollection("events-posts", locale as LocaleOption, {
        sort: { field: "date", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("events-posts", locale as LocaleOption, {
        sort: { field: "date", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="events" currentPageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}
      <main>
        <EventPost eventPost={eventPost} allEventsPosts={allEventsPosts} />
      </main>
    </PageWrapper>
  );
};

export default EventPostPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the event post page
export const generateMetadata = async ({
  params,
}: EventPostPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const eventsT = await getTranslations("events");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: eventsT("notFound"),
    };
  }

  const eventPost = await getCachedDocument(
    "events-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )();

  if (!eventPost) {
    return {
      title: eventsT("notFound"),
    };
  }

  const metadata = await getMetadata({
    doc: eventPost,
    locale: locale,
    openGraphType: "article",
    publishedTime: eventPost.publishedAt
      ? new Date(eventPost.publishedAt).toISOString()
      : undefined,
  });

  // Fallback to "events title | event post title" if meta title is not set
  if (!metadata.title && eventPost.title) {
    return {
      ...metadata,
      title: `${eventsT("title")} | ${eventPost.title}`,
      openGraph: {
        ...metadata.openGraph,
        title: `${eventsT("title")} | ${eventPost.title}`,
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  try {
    const payload = await getCachedPayload();
    const params: { locale: string; slug: string }[] = [];

    for (const locale of LOCALES) {
      const eventsPosts = await payload.find({
        collection: "events-posts",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        locale,
        where: {
          _status: {
            equals: "published",
          },
        },
        select: {
          slug: true,
        },
      });

      eventsPosts.docs?.forEach((doc) => {
        if (doc.slug) {
          params.push({ locale, slug: doc.slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for events. Database migration needed.",
      error,
    );

    return [];
  }
};
