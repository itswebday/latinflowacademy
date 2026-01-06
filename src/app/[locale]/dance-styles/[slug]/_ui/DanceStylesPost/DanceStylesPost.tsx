import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";
import type { DanceStyleData } from "@/app/[locale]/dance-styles/_ui/DanceStyles/DanceStylesClient";
import OtherDanceStyles from "./OtherDanceStyles";
import DanceStylesPostClient from "./DanceStylesPostClient";

type DanceStylesPostProps = {
  danceStylesPost: Config["collections"]["dance-styles-posts"];
  allDanceStylesPosts: Config["collections"]["dance-styles-posts"][];
};

const DanceStylesPost: React.FC<DanceStylesPostProps> = async ({
  danceStylesPost,
  allDanceStylesPosts,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const danceStylesT = await getTranslations("danceStyles");

  // Landscape image
  const landscapeImage =
    typeof danceStylesPost.landscapeImage === "object" &&
    danceStylesPost.landscapeImage !== null &&
    "url" in danceStylesPost.landscapeImage
      ? danceStylesPost.landscapeImage
      : null;

  // Rendered content
  const renderedContent = danceStylesPost.description ? (
    <RichTextRenderer richText={danceStylesPost.description} />
  ) : null;

  // Process other dance styles data
  const otherDanceStyles: DanceStyleData[] = allDanceStylesPosts
    .filter((s) => s.slug !== danceStylesPost.slug && s.slug && s.url)
    .map((s) => {
      const { url: squareImageURL, alt: squareImageAlt } = getMediaUrlAndAlt(
        s.squareImage,
      );

      return {
        id: s.id,
        slug: s.slug!,
        url: s.url!,
        squareImageURL: squareImageURL,
        squareImageAlt: squareImageAlt,
        name: s.name,
        title: s.title,
      };
    });

  return (
    <>
      {/* Content */}
      <article className={twMerge("w-full")}>
        <DanceStylesPostClient
          landscapeImage={landscapeImage}
          name={danceStylesPost.name}
          title={danceStylesPost.title}
          renderedContent={renderedContent}
          iframeUrl={danceStylesPost.iframeUrl}
        />
      </article>

      {/* Other dance styles */}
      <OtherDanceStyles
        danceStyles={otherDanceStyles}
        locale={locale}
        headingText={danceStylesT("otherPosts.heading")}
      />
    </>
  );
};

export default DanceStylesPost;
