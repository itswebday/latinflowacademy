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
import { Blog } from "./_ui";

const BlogPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const blog = draft.isEnabled
    ? await getGlobal("blog", locale)
    : await getCachedGlobal("blog", locale)();
  const blogPosts = draft.isEnabled
    ? await getCollection("blog-posts", locale, {
        sort: { field: "publishedAt", direction: "desc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("blog-posts", locale, {
        sort: { field: "publishedAt", direction: "desc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="blog">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Blog blog={blog} blogPosts={blogPosts} />
      </main>
    </PageWrapper>
  );
};

export default BlogPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the blog page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const blog = await getCachedGlobal("blog", locale)();
  const blogT = await getTranslations("blog");
  const metadata = await getMetadata({ doc: blog, locale });

  // Fallback to blog title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: blogT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: blogT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
