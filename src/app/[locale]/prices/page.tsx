import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
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

  return (
    <PageWrapper currentPage="prices">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Prices prices={prices} />
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
