import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption, RichText } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CookiePolicy } from "./_ui";

const CookiePolicyPage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  // Use cached global for published content, direct for draft mode
  const cookiePolicy = draft.isEnabled
    ? await getGlobal("cookie-policy", locale, true)
    : await getCachedGlobal("cookie-policy", locale)();

  if (!cookiePolicy) {
    notFound();
  }

  return (
    <PageWrapper currentPage="cookie-policy">
      <main>
        {draft.isEnabled && <PreviewListener />}
        {cookiePolicy &&
          typeof cookiePolicy === "object" &&
          "content" in cookiePolicy &&
          cookiePolicy.content && (
            <CookiePolicy content={cookiePolicy.content as RichText} />
          )}
      </main>
    </PageWrapper>
  );
};

export default CookiePolicyPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the cookie policy page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const cookiePolicy = await getCachedGlobal("cookie-policy", locale)();
  const cookiePolicyT = await getTranslations("cookiePolicy");
  const metadata = await getMetadata({ doc: cookiePolicy, locale });

  // Fallback to cookie policy title from messages if meta title is not set
  if (!metadata.title) {
    return {
      ...metadata,
      title: cookiePolicyT("title"),
      openGraph: {
        ...metadata.openGraph,
        title: cookiePolicyT("title"),
      },
    };
  }

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
