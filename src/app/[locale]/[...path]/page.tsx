import { PageWrapper, PreviewListener } from "@/components";
import { blockComponents } from "@/blocks";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { Page } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMetadata } from "@/utils/metadata";
import { getCachedGlobals, getGlobals } from "@/utils/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getCachedPayload } from "@/utils/payload";
import { unstable_cache } from "next/cache";

type PageProps = {
  params: Promise<{
    locale: string;
    path: string[];
  }>;
};

const PageComponent = async ({ params }: PageProps) => {
  const { locale = DEFAULT_LOCALE, path } = await params;

  if (!LOCALES.includes(locale as LocaleOption)) {
    return notFound();
  }

  const draft = await draftMode();
  const url =
    path && path.length > 0
      ? `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/${path.join("/")}`
      : locale === DEFAULT_LOCALE
        ? "/"
        : `/${locale}`;
  const page = await queryPageByUrl({
    url: url,
    locale: locale as LocaleOption,
    draft: draft.isEnabled,
  });

  if (!page || !page.slug) {
    return notFound();
  }

  const { blocks, slug } = page;
  const blockTypeCounts = new Map<string, number>();
  const globals = draft.isEnabled
    ? await getGlobals(locale as LocaleOption, true)
    : await getCachedGlobals(locale as LocaleOption)();

  return (
    <PageWrapper currentPage="home" currentPageSlug={slug}>
      <main>
        {draft.isEnabled && <PreviewListener />}
        {blocks && Array.isArray(blocks) && blocks.length > 0 && (
          <>
            {blocks.map((block, index) => {
              const BlockComponent = blockComponents[
                block.blockType
              ] as React.ComponentType<typeof block>;

              if (BlockComponent) {
                const currentCount =
                  (blockTypeCounts.get(block.blockType) || 0) + 1;

                blockTypeCounts.set(block.blockType, currentCount);

                const blockWithSettings = block as typeof block & {
                  applyCustomId?: boolean;
                  customId?: string;
                };
                const blockId =
                  blockWithSettings.applyCustomId && blockWithSettings.customId
                    ? blockWithSettings.customId
                    : `${block.blockType}-${currentCount}`;
                const blockProps = {
                  ...block,
                  id: blockId,
                  globals,
                };

                return <BlockComponent key={index} {...blockProps} />;
              }

              return null;
            })}
          </>
        )}
      </main>
    </PageWrapper>
  );
};

export default PageComponent;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the page
export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, path } = await params;
  const pageNotFoundT = await getTranslations("pageNotFound");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: pageNotFoundT("title"),
    };
  }

  const url =
    path && path.length > 0
      ? `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/${path.join("/")}`
      : locale === DEFAULT_LOCALE
        ? "/"
        : `/${locale}`;
  const page = await queryPageByUrl({
    url: url,
    locale: locale as LocaleOption,
    draft: false,
  });

  const metadata = await getMetadata({ doc: page, locale });

  // Fallback to page title if meta title is not set
  if (!metadata.title && page?.title) {
    return {
      ...metadata,
      title: page.title,
      openGraph: {
        ...metadata.openGraph,
        title: page.title,
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  try {
    const payload = await getCachedPayload();
    const params: { locale: string; path: string[] }[] = [];

    for (const locale of LOCALES) {
      const pages = await payload.find({
        collection: "pages",
        locale: locale,
        select: {
          urlWithoutLocale: true,
        },
        limit: 1000,
        pagination: false,
        draft: false,
        overrideAccess: false,
      });

      pages.docs?.forEach((doc) => {
        if (
          doc.urlWithoutLocale === null ||
          !doc.urlWithoutLocale ||
          doc.urlWithoutLocale === "/"
        ) {
          return;
        }

        params.push({ locale, path: doc.urlWithoutLocale.slice(1).split("/") });
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for pages. Database migration needed.",
      error,
    );

    return [];
  }
};

const queryPageByUrl = async ({
  url,
  locale,
  draft,
}: {
  url: string;
  locale: LocaleOption;
  draft: boolean;
}): Promise<Page | null> => {
  // Use direct query for draft mode (no caching)
  if (draft) {
    const payload = await getCachedPayload();
    const result = await payload.find({
      collection: "pages",
      locale: locale,
      where: {
        url: {
          equals: url,
        },
      },
      limit: 1,
      pagination: false,
      draft: true,
      overrideAccess: true,
    });

    return (result.docs?.[0] as Page) || null;
  }

  // Use cached query for published pages
  const cachedQuery = unstable_cache(
    async () => {
      const payload = await getCachedPayload();
      const result = await payload.find({
        collection: "pages",
        locale: locale,
        where: {
          and: [
            {
              url: {
                equals: url,
              },
            },
            { _status: { equals: "published" } },
          ],
        },
        limit: 1,
        pagination: false,
        draft: false,
        overrideAccess: false,
      });

      return (result.docs?.[0] as Page) || null;
    },
    [`page_${url}_${locale}`],
    {
      tags: [`pages_${locale}`, `page_${url}_${locale}`],
    },
  );

  return cachedQuery();
};
