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
import { DanceStyles } from "./_ui";

const DanceStylesPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const danceStyles = draft.isEnabled
    ? await getGlobal("dance-styles", locale)
    : await getCachedGlobal("dance-styles", locale)();
  const danceStylesPosts = draft.isEnabled
    ? await getCollection("dance-styles-posts", locale, {
        sort: { field: "publishedAt", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("dance-styles-posts", locale, {
        sort: { field: "publishedAt", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="danceStyles">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <DanceStyles
          danceStyles={danceStyles}
          danceStylesPosts={danceStylesPosts}
        />
      </main>
    </PageWrapper>
  );
};

export default DanceStylesPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the dance styles page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const danceStyles = await getCachedGlobal("dance-styles", locale)();
  const danceStylesT = await getTranslations("danceStyles");
  const metadata = await getMetadata({ doc: danceStyles, locale });

  // Fallback to dance styles title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: danceStylesT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: danceStylesT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
