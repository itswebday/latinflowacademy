import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";
import type { TeacherData } from "@/app/[locale]/teachers/_ui/Teachers/TeachersClient";
import OtherTeachers from "./OtherTeachers";
import TeachersPostClient from "./TeachersPostClient";

type TeachersPostProps = {
  teachersPost: Config["collections"]["teachers-posts"];
  allTeachersPosts: Config["collections"]["teachers-posts"][];
};

const TeachersPost: React.FC<TeachersPostProps> = async ({
  teachersPost,
  allTeachersPosts,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const teachersT = await getTranslations("teachers");

  // Image
  const image =
    typeof teachersPost.image === "object" &&
    teachersPost.image !== null &&
    "url" in teachersPost.image
      ? teachersPost.image
      : null;

  // Rendered content
  const renderedContent = teachersPost.description ? (
    <RichTextRenderer richText={teachersPost.description} />
  ) : null;

  // Process other teachers data
  const otherTeachers: TeacherData[] = allTeachersPosts
    .filter((t) => t.slug !== teachersPost.slug && t.slug && t.url)
    .map((t) => {
      const { url: imageURL, alt: imageAlt } = getMediaUrlAndAlt(t.image);

      return {
        id: t.id,
        slug: t.slug!,
        url: t.url!,
        imageURL: imageURL,
        imageAlt: imageAlt,
        name: t.name,
      };
    });

  return (
    <>
      {/* Content */}
      <article className={twMerge("w-full")}>
        <section className={twMerge("w-full py-12", "de:py-20")}>
          {/* Container */}
          <div
            className={twMerge(
              "relative flex justify-between items-center w-11/12 max-w-5xl mx-auto",
            )}
          >
            <TeachersPostClient
              className="max-w-5xl"
              image={image}
              name={teachersPost.name}
              renderedContent={renderedContent}
            />
          </div>
        </section>
      </article>

      {/* Other teachers */}
      <OtherTeachers
        teachers={otherTeachers}
        locale={locale}
        headingText={teachersT("otherPosts.heading")}
      />
    </>
  );
};

export default TeachersPost;
