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
import { TeachersPost } from "./_ui";

type TeacherPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const TeacherPage = async ({ params }: TeacherPageProps) => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const teachersT = await getTranslations("teachers");

  if (!LOCALES.includes(locale as LocaleOption)) {
    redirect(teachersT("url"));
  }

  const draft = await draftMode();
  const teacher = draft.isEnabled
    ? ((await getDocument(
        "teachers-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )) as Config["collections"]["teachers-posts"] | null)
    : await getCachedDocument(
        "teachers-posts",
        "slug",
        slug,
        locale as LocaleOption,
        2,
      )();

  if (!teacher) {
    redirect(teachersT("url"));
  }

  if (!draft.isEnabled && teacher._status !== "published") {
    redirect(teachersT("url"));
  }

  const allTeachers = draft.isEnabled
    ? await getCollection("teachers-posts", locale as LocaleOption, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })
    : await getCachedCollection("teachers-posts", locale as LocaleOption, {
        sort: { field: "id", direction: "asc" },
        filters: [{ field: "_status", operator: "equals", value: "published" }],
        depth: 1,
      })();

  return (
    <PageWrapper currentPage="teachers" currentPageSlug={slug}>
      {draft.isEnabled && <PreviewListener />}
      <main>
        <TeachersPost teachersPost={teacher} allTeachersPosts={allTeachers} />
      </main>
    </PageWrapper>
  );
};

export default TeacherPage;

// Enable ISR: cache the page for 24 hours, revalidate in background
export const revalidate = 86400;

// Generate metadata for the teacher page
export const generateMetadata = async ({
  params,
}: TeacherPageProps): Promise<Metadata> => {
  const { locale = DEFAULT_LOCALE, slug } = await params;
  const teachersT = await getTranslations("teachers");

  if (!LOCALES.includes(locale as LocaleOption)) {
    return {
      title: teachersT("notFound"),
    };
  }

  const teacher = await getCachedDocument(
    "teachers-posts",
    "slug",
    slug,
    locale as LocaleOption,
    2,
  )();

  if (!teacher) {
    return {
      title: teachersT("notFound"),
    };
  }

  const metadata = await getMetadata({
    doc: teacher,
    locale: locale,
    openGraphType: "article",
    publishedTime: teacher.publishedAt
      ? new Date(teacher.publishedAt).toISOString()
      : undefined,
  });

  // Fallback to "teachers title | teacher name" if meta title is not set
  if (!metadata.title && teacher.name) {
    return {
      ...metadata,
      title: `${teachersT("title")} | ${teacher.name}`,
      openGraph: {
        ...metadata.openGraph,
        title: `${teachersT("title")} | ${teacher.name}`,
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
      const teachers = await payload.find({
        collection: "teachers-posts",
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

      teachers.docs?.forEach((doc) => {
        if (doc.slug) {
          params.push({ locale, slug: doc.slug });
        }
      });
    }

    return params;
  } catch (error) {
    console.warn(
      "Failed to generate static params for teachers. Database migration needed.",
      error,
    );

    return [];
  }
};
