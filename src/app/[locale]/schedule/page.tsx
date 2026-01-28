import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageWrapper, PreviewListener } from "@/components";
import { LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import { getCachedGlobal, getGlobal, getMetadata } from "@/utils/server";
import { Schedule } from "./_ui";

const SchedulePage = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;

  if (!LOCALES.includes(locale)) {
    return notFound();
  }

  const schedule = draft.isEnabled
    ? await getGlobal("schedule", locale)
    : await getCachedGlobal("schedule", locale)();

  return (
    <PageWrapper currentPage="schedule">
      <main>
        {draft.isEnabled && <PreviewListener />}
        <Schedule schedule={schedule} />
      </main>
    </PageWrapper>
  );
};

export default SchedulePage;

// Enable ISR: cache the page for 1 hour, revalidate in background
export const revalidate = 3600;

// Generate metadata for the schedule page
export const generateMetadata = async (): Promise<Metadata> => {
  const locale = (await getLocale()) as LocaleOption;
  const schedule = await getCachedGlobal("schedule", locale)();
  const metadata = await getMetadata({ doc: schedule, locale });

  return metadata;
};

// Generate static params for all locales at build time
export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({ locale }));
};
