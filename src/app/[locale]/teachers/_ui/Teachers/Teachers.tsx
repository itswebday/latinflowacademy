import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt, highlightText } from "@/utils";
import TeachersClient from "./TeachersClient";

type TeachersProps = {
  teachers: Config["globals"]["teachers"];
  teachersPosts: Config["collections"]["teachers-posts"][];
};

const Teachers: React.FC<TeachersProps> = async ({
  teachers,
  teachersPosts,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const teachersT = await getTranslations("teachers");

  // Text
  const processedText =
    typeof teachers.text === "string" && teachers.hlTexts
      ? highlightText(
          teachers.text,
          teachers.hlTexts,
          "mx-1 text-[28px] font-bold",
        )
      : teachers.text;

  return (
    <section className="relative flex justify-center py-20">
      {/* Container */}
      <div className="max-w-5xl w-11/12">
        {/* Heading and text */}
        <div
          className={twMerge(
            "flex flex-col items-center gap-3 w-5/6 max-w-3xl mx-auto",
            "text-center mb-12",
            "de:mb-16",
          )}
        >
          {/* Heading */}
          <HeadingWithIcon
            className="flex flex-col items-center gap-1"
            icon={teachers.heading.icon}
          >
            <h1 className="font-bold text-dark">
              {typeof teachers.heading.text === "string" &&
              teachers.heading.hlTexts
                ? highlightText(teachers.heading.text, teachers.heading.hlTexts)
                : teachers.heading.text}
            </h1>
          </HeadingWithIcon>

          {/* Text */}
          <p className="uppercase leading-8 text-center">{processedText}</p>
        </div>

        {/* Teachers */}
        {teachersPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark/60">{teachersT("noPosts")}</p>
          </div>
        ) : (
          <TeachersClient
            teachers={teachersPosts
              .filter((teacher) => teacher.slug && teacher.url)
              .map((teacher) => {
                const { url: imageURL, alt: imageAlt } = getMediaUrlAndAlt(
                  teacher.image,
                );

                return {
                  id: teacher.id,
                  slug: teacher.slug!,
                  url: teacher.url!,
                  imageURL: imageURL,
                  imageAlt: imageAlt,
                  name: teacher.name,
                };
              })}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
};

export default Teachers;
