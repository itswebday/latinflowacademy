"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { ButtonLink } from "@/components";
import type { Config } from "@/payload-types";

type NewsAsideProps = {
  className?: string;
  newsPosts: Config["collections"]["news-posts"][];
};

const NewsAside: React.FC<NewsAsideProps> = ({ className, newsPosts }) => {
  const newsT = useTranslations("news");

  if (newsPosts.length === 0) {
    return null;
  }

  return (
    <nav className={twMerge("flex flex-col gap-6", className)}>
      {/* Heading */}
      <header>
        <h3>{newsT("otherPosts.heading")}</h3>
      </header>

      {/* List */}
      <div className="flex flex-col gap-2">
        {newsPosts.map((post, index) => {
          const url = post.url || "#";

          return (
            <ButtonLink key={index} variant="grayLink" href={url}>
              {post.title}
            </ButtonLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NewsAside;
