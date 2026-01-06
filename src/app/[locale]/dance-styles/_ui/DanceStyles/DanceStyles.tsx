import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt, highlightText } from "@/utils";
import DanceStylesClient from "./DanceStylesClient";

type DanceStylesProps = {
  danceStyles: Config["globals"]["dance-styles"];
  danceStylesPosts: Config["collections"]["dance-styles-posts"][];
};

const DanceStyles: React.FC<DanceStylesProps> = async ({
  danceStyles,
  danceStylesPosts,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const danceStylesT = await getTranslations("danceStyles");

  const processedText =
    typeof danceStyles.text === "string" && danceStyles.hlTexts
      ? highlightText(
          danceStyles.text,
          danceStyles.hlTexts,
          "mx-1 text-[28px] font-bold",
        )
      : danceStyles.text;

  return (
    <section className="relative flex justify-center py-20">
      {/* Container */}
      <div className="max-w-7xl w-11/12">
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
            icon={danceStyles.heading.icon}
          >
            <h1 className="font-bold">
              {typeof danceStyles.heading.text === "string" &&
              danceStyles.heading.hlTexts
                ? highlightText(
                    danceStyles.heading.text,
                    danceStyles.heading.hlTexts,
                  )
                : danceStyles.heading.text}
            </h1>
          </HeadingWithIcon>

          {/* Text */}
          <p className="uppercase leading-8 text-center">{processedText}</p>
        </div>

        {/* Dance styles */}
        {danceStylesPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark/60">{danceStylesT("noPosts")}</p>
          </div>
        ) : (
          <DanceStylesClient
            danceStyles={danceStylesPosts
              .filter((style) => style.slug && style.url)
              .map((style) => {
                const { url: squareImageURL, alt: squareImageAlt } =
                  getMediaUrlAndAlt(style.squareImage);

                return {
                  id: style.id,
                  slug: style.slug!,
                  url: style.url!,
                  squareImageURL: squareImageURL,
                  squareImageAlt: squareImageAlt,
                  name: style.name,
                  title: style.title,
                };
              })}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
};

export default DanceStyles;
