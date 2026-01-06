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
import { News } from "./_ui";

const NewsPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const news = draft.isEnabled
    ? await getGlobal("news", locale)
    : await getCachedGlobal("news", locale)();
  const newsPosts = draft.isEnabled
    ? await getCollection("news-posts", locale, {
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
    : await getCachedCollection("news-posts", locale, {
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
    <PageWrapper currentPage="news">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <News news={news} newsPosts={newsPosts} />
      </main>
    </PageWrapper>
  );
};

export default NewsPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the news page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const news = await getCachedGlobal("news", locale)();
  const newsT = await getTranslations("news");
  const metadata = await getMetadata({ doc: news, locale });

  // Fallback to news title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: newsT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: newsT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
