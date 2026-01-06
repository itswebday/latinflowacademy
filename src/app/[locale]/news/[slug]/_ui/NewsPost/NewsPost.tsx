import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import type { LocaleOption, RawUrl, RichText } from "@/types";
import { getUrl } from "@/utils";
import { getGlobals } from "@/utils/server";
import NewsAside from "../NewsAside";
import NewsPostClient from "./NewsPostClient";

type NewsPostProps = {
  newsPost: Config["collections"]["news-posts"];
  allNewsPosts: Config["collections"]["news-posts"][];
};

const NewsPost = async ({ newsPost, allNewsPosts }: NewsPostProps) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getGlobals(locale);

  // Rendered summary
  const renderedSummary = newsPost.summary ? (
    <RichTextRenderer richText={newsPost.summary as RichText} />
  ) : null;

  // Rendered content
  const renderedContent = newsPost.content ? (
    <RichTextRenderer richText={newsPost.content as RichText} />
  ) : null;

  // Button URL
  const buttonUrl =
    newsPost.showButton && newsPost.button
      ? getUrl(newsPost.button as RawUrl, globals)
      : undefined;

  // Filter other news posts for sidebar
  const otherNewsPosts = allNewsPosts.filter(
    (post) => post.slug !== newsPost.slug && post.slug && post.url,
  );

  return (
    <section className="flex justify-center w-full py-20">
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col justify-center items-center gap-20 w-11/12 max-w-5xl",
          "de:flex-row de:items-start de:gap-20",
        )}
      >
        {/* News post */}
        <article className={twMerge("w-full", "de:w-3/5")}>
          <NewsPostClient
            newsPost={{
              ...newsPost,
              renderedSummary: renderedSummary,
              renderedContent: renderedContent,
              buttonUrl: buttonUrl,
            }}
          />
        </article>

        {/* Other news posts */}
        <aside className={twMerge("flex flex-col gap-4 w-full", "de:w-2/5")}>
          <NewsAside newsPosts={otherNewsPosts} />
        </aside>
      </div>
    </section>
  );
};

export default NewsPost;
