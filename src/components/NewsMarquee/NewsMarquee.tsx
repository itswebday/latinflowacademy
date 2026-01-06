"use server";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { LocaleOption } from "@/types";
import { getCollection } from "@/utils/server";
import Marquee from "./Marquee";

type NewsMarqueeProps = {
  className?: string;
};

const NewsMarquee: React.FC<NewsMarqueeProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const newsT = await getTranslations("news");

  // Fetch future news posts (date > today)
  const newsPosts = await getCollection("news-posts", locale, {
    sort: { field: "date", direction: "desc" },
    filters: [
      { field: "_status", operator: "equals", value: "published" },
      {
        field: "date",
        operator: "greater_than",
        value: new Date().toISOString(),
      },
    ],
    depth: 1,
  });

  if (newsPosts.length === 0) {
    return null;
  }

  return (
    <aside
      id="news-marquee"
      className={twMerge(
        "z-50 absolute left-0 top-0 flex items-center w-full h-news-marquee",
        "bg-light/50",
        className,
      )}
    >
      <Marquee className="h-full">
        {newsPosts.map((post, index) => {
          const url = post.url || "#";

          return (
            <div
              key={index}
              className={twMerge("flex items-center gap-3 px-10 h-full")}
            >
              {/* Headline */}
              <span className="text-[18px]">{post.title}</span>

              {/* Link */}
              <Link
                className={twMerge(
                  "text-[14px] font-semibold transition-colors duration-200",
                  "hover:text-primary underline",
                )}
                href={url}
                prefetch={true}
              >
                {newsT("readMore")}
              </Link>

              {/* Plus signs */}
              <span className="text-[20px] font-normal text-primary">+++</span>
            </div>
          );
        })}
      </Marquee>
    </aside>
  );
};

export default NewsMarquee;
