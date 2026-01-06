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
import { NewsPost } from "./_ui";

type NewsPostPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const NewsPostPage = async ({ params }: NewsPostPageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const newsT = await getTranslations("news");

  if (!LOCALES.includes(locale as LocaleOption)) {
    redirect(newsT("url"));
  }

  const draft = await draftMode();
  const newsPost = draft.isEnabled
    ? ((await getDocument(
        "news-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )) as Config["collections"]["news-posts"] | null)
    : await getCachedDocument(
        "news-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )();

  if (!newsPost) {
    redirect(newsT("url"));
  }

  if (!draft.isEnabled && newsPost._status !== "published") {
    redirect(newsT("url"));
  }

  const allNewsPosts = draft.isEnabled
    ? await getCollection("news-posts", locale as LocaleOption, {
        sort: { field: "date", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("news-posts", locale as LocaleOption, {
        sort: { field: "date", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="news" currentPageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}
      <main>
        <NewsPost newsPost={newsPost} allNewsPosts={allNewsPosts} />
      </main>
    </PageWrapper>
  );
};

export default NewsPostPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the news post page
export const generateMetadata = async ({
  params,
}: NewsPostPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const newsT = await getTranslations("news");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: newsT("notFound"),
    };
  }

  const newsPost = await getCachedDocument(
    "news-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )();

  if (!newsPost) {
    return {
      title: newsT("notFound"),
    };
  }

  const metadata = await getMetadata({
    doc: newsPost,
    locale: locale,
    openGraphType: "article",
    publishedTime: newsPost.publishedAt
      ? new Date(newsPost.publishedAt).toISOString()
      : undefined,
  });

  // Fallback to "news title | news post title" if meta title is not set
  if (!metadata.title && newsPost.title) {
    return {
      ...metadata,
      title: `${newsT("title")} | ${newsPost.title}`,
      openGraph: {
        ...metadata.openGraph,
        title: `${newsT("title")} | ${newsPost.title}`,
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
      const newsPosts = await payload.find({
        collection: "news-posts",
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

      newsPosts.docs?.forEach((doc) => {
        if (doc.slug) {
          params.push({ locale, slug: doc.slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for news. Database migration needed.",
      error,
    );

    return [];
  }
};
