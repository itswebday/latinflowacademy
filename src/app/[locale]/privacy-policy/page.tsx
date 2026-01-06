import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PrivacyPolicy } from "./_ui";

const PrivacyPolicyPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  // Use cached global for published content, direct for draft mode
  const privacyPolicy = draft.isEnabled
    ? await getGlobal("privacy-policy", locale, true)
    : await getCachedGlobal("privacy-policy", locale)();

  if (!privacyPolicy) {
    notFound();
  }

  return (
    <PageWrapper currentPage="privacy-policy">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {privacyPolicy &&
          typeof privacyPolicy === "object" &&
          "content" in privacyPolicy &&
          privacyPolicy.content && (
            <PrivacyPolicy content={privacyPolicy.content as RichText} />
          )}
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the privacy policy page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const privacyPolicy = await getCachedGlobal("privacy-policy", locale)();
  const privacyPolicyT = await getTranslations("privacyPolicy");
  const metadata = await getMetadata({ doc: privacyPolicy, locale });

  // Fallback to privacy policy title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: privacyPolicyT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: privacyPolicyT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
