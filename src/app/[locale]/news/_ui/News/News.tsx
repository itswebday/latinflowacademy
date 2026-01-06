import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import { HeadingWithIcon } from "@/components";
import type { Config } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import { getCollection } from "@/utils/server";
import NewsAside from "../../[slug]/_ui/NewsAside";
import NewsClient from "./NewsClient";

type NewsProps = {
  news: Config["globals"]["news"];
  newsPosts: Config["collections"]["news-posts"][];
};

const News: React.FC<NewsProps> = async ({ news, newsPosts }) => {
  const locale = (await getLocale()) as LocaleOption;
  const newsT = await getTranslations("news");

  // Filter other news posts for sidebar
  const allNewsPosts = await getCollection("news-posts", locale, {
    sort: { field: "date", direction: "asc" },
    filters: [{ field: "_status", operator: "equals", value: "published" }],
    depth: 1,
  });

  return (
    <section className="relative flex justify-center w-full py-20">
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col items-center gap-4",
          "w-11/12 max-w-7xl mx-auto",
        )}
      >
        {/* Heading */}
        <HeadingWithIcon icon={news.heading.icon}>
          <h1 className="font-bold">{news.heading.text}</h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-2xl mx-auto text-dark/70 text-center">
          {news.paragraph.text}
        </p>

        {/* News posts and other news posts */}
        <div
          className={twMerge(
            "flex flex-col gap-4 w-full",
            "de:flex-row de:gap-20",
          )}
        >
          {/* News posts */}
          <div className={twMerge("w-full", "de:w-3/5")}>
            {newsPosts.length === 0 ? (
              <p className="my-16 text-dark/60 text-center">
                {newsT("noPosts")}
              </p>
            ) : (
              <NewsClient
                className="mt-16"
                newsPosts={newsPosts
                  .filter((post) => post.url && post.slug)
                  .map((post) => ({
                    ...post,
                    renderedSummary: post.summary ? (
                      <RichTextRenderer richText={post.summary as RichText} />
                    ) : null,
                  }))}
              />
            )}
          </div>

          {/* Other news items */}
          <aside className="w-full mt-16 de:w-2/5">
            <NewsAside newsPosts={allNewsPosts} />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default News;
