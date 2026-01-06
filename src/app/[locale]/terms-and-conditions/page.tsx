import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal } from "@/utils/server";
import { getMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { TermsAndConditions } from "./_ui";

const TermsAndConditionsPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  // Use cached global for published content, direct for draft mode
  const termsAndConditions = draft.isEnabled
    ? await getGlobal("terms-and-conditions", locale, true)
    : await getCachedGlobal("terms-and-conditions", locale)();

  if (!termsAndConditions) {
    notFound();
  }

  return (
    <PageWrapper currentPage="terms-and-conditions">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {termsAndConditions &&
          typeof termsAndConditions === "object" &&
          "content" in termsAndConditions &&
          termsAndConditions.content && (
            <TermsAndConditions
              content={termsAndConditions.content as RichText}
            />
          )}
      </main>
    </PageWrapper>
  );
};

export default TermsAndConditionsPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the terms and conditions page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const termsAndConditions = await getCachedGlobal(
    "terms-and-conditions",
    locale,
  )();
  const termsAndConditionsT = await getTranslations("termsAndConditions");
  const metadata = await getMetadata({ doc: termsAndConditions, locale });

  // Fallback to terms and conditions title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: termsAndConditionsT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: termsAndConditionsT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
