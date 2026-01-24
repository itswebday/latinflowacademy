import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { blockComponents } from "@/blocks";
import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption, Globals } from "@/types";
import {
  getCachedGlobal,
  getCachedGlobals,
  getGlobal,
  getGlobals,
  getMetadata,
} from "@/utils/server";
import { Prices } from "./_ui";

const PricesPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  if (!LOCALES.includes(locale)) {
    return notFound();
  }

  const prices = draft.isEnabled
    ? await getGlobal("prices", locale)
    : await getCachedGlobal("prices", locale)();

  const globals = draft.isEnabled
    ? await getGlobals(locale, true)
    : await getCachedGlobals(locale)();

  const blocks = (
    prices as {
      blocks?: unknown[];
    }
  ).blocks;

  const blockTypeCounts = new Map<string, number>();

  return (
    <PageWrapper currentPage="prices">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Prices prices={prices} />
        {blocks && Array.isArray(blocks) && blocks.length > 0 && (
          <>
            {blocks.map((block, index) => {
              const typedBlock = block as { blockType: string } & Record<
                string,
                unknown
              >;
              const blockType =
                typedBlock.blockType as keyof typeof blockComponents;
              const BlockComponent = blockComponents[blockType] as unknown as
                | React.ComponentType<
                    Record<string, unknown> & { id?: string; globals: Globals }
                  >
                | undefined;

              if (BlockComponent) {
                const currentCount = (blockTypeCounts.get(blockType) || 0) + 1;

                blockTypeCounts.set(blockType, currentCount);

                const blockWithSettings = typedBlock as typeof typedBlock & {
                  applyCustomId?: boolean;
                  customId?: string;
                };
                const blockId =
                  blockWithSettings.applyCustomId && blockWithSettings.customId
                    ? blockWithSettings.customId
                    : `${blockType}-${currentCount}`;
                const blockProps = {
                  ...typedBlock,
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

export default PricesPage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the prices page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const prices = await getCachedGlobal("prices", locale)();
  const metadata = await getMetadata({ doc: prices, locale });

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
