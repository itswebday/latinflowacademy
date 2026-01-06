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
import { Teachers } from "./_ui";

const TeachersPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const teachers = draft.isEnabled
    ? await getGlobal("teachers", locale)
    : await getCachedGlobal("teachers", locale)();
  const teachersPosts = draft.isEnabled
    ? await getCollection("teachers-posts", locale, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("teachers-posts", locale, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="teachers">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Teachers teachers={teachers} teachersPosts={teachersPosts} />
      </main>
    </PageWrapper>
  );
};

export default TeachersPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the teachers page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const teachers = await getCachedGlobal("teachers", locale)();
  const teachersT = await getTranslations("teachers");
  const metadata = await getMetadata({ doc: teachers, locale });

  // Fallback to teachers title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: teachersT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: teachersT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
