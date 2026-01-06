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
import { DanceStylesPost } from "./_ui";

type DanceStylePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const DanceStylePage = async ({ params }: DanceStylePageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const danceStylesT = await getTranslations("danceStyles");

  if (!LOCALES.includes(locale as LocaleOption)) {
    redirect(danceStylesT("url"));
  }

  const draft = await draftMode();
  const danceStyle = draft.isEnabled
    ? ((await getDocument(
        "dance-styles-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )) as Config["collections"]["dance-styles-posts"] | null)
    : await getCachedDocument(
        "dance-styles-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )();

  if (!danceStyle) {
    redirect(danceStylesT("url"));
  }

  if (!draft.isEnabled && danceStyle._status !== "published") {
    redirect(danceStylesT("url"));
  }

  const allDanceStyles = draft.isEnabled
    ? await getCollection("dance-styles-posts", locale as LocaleOption, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("dance-styles-posts", locale as LocaleOption, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="danceStyles" currentPageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}
      <main>
        <DanceStylesPost
          danceStylesPost={danceStyle}
          allDanceStylesPosts={allDanceStyles}
        />
      </main>
    </PageWrapper>
  );
};

export default DanceStylePage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the dance style page
export const generateMetadata = async ({
  params,
}: DanceStylePageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const danceStylesT = await getTranslations("danceStyles");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: danceStylesT("notFound"),
    };
  }

  const danceStyle = await getCachedDocument(
    "dance-styles-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )();

  if (!danceStyle) {
    return {
      title: danceStylesT("notFound"),
    };
  }

  const metadata = await getMetadata({
    doc: danceStyle,
    locale: locale,
    openGraphType: "article",
    publishedTime: danceStyle.publishedAt
      ? new Date(danceStyle.publishedAt).toISOString()
      : undefined,
  });

  // Fallback to "dance styles title | dance style name" if meta title is not set
  if (!metadata.title && danceStyle.name) {
    return {
      ...metadata,
      title: `${danceStylesT("title")} | ${danceStyle.name}`,
      openGraph: {
        ...metadata.openGraph,
        title: `${danceStylesT("title")} | ${danceStyle.name}`,
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
      const danceStyles = await payload.find({
        collection: "dance-styles-posts",
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

      danceStyles.docs?.forEach((doc) => {
        if (doc.slug) {
          params.push({ locale, slug: doc.slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for dance styles. Database migration needed.",
      error,
    );

    return [];
  }
};
