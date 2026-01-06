import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { blockComponents } from "@/blocks";
import { PageWrapper, PreviewListener } from "@/components";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedGlobals, getGlobals, getMetadata } from "@/utils/server";
import { Hero } from "./_ui";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const HomePage = async ({ params }: HomePageProps) => {
  const draft = await draftMode();
  const { locale = DEFAULT_LOCALE } = await params;

  if (!LOCALES.includes(locale as LocaleOption)) {
    return notFound();
  }

  const globals = draft.isEnabled
    ? await getGlobals(locale as LocaleOption, true)
    : await getCachedGlobals(locale as LocaleOption)();
  const blocks = globals.home?.blocks;
  const blockTypeCounts = new Map<string, number>();

  return (
    <PageWrapper currentPage="home">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Hero />
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

export default HomePage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the home page
export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE } = await params;
  const pageNotFoundT = await getTranslations("pageNotFound");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: pageNotFoundT("title"),
    };
  }

  const globals = await getCachedGlobals(locale as LocaleOption)();
  const homeT = await getTranslations("home");
  const metadata = await getMetadata({ doc: globals.home, locale });

  // Fallback to home title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: homeT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: homeT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
