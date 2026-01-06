"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";

type BlogPostClientProps = {
  className?: string;
  blogPost: Config["collections"]["blog-posts"];
  renderedContent: ReactNode;
};

const BlogPostClient: React.FC<BlogPostClientProps> = ({
  className,
  blogPost,
  renderedContent,
}) => {
  const locale = useLocale() as LocaleOption;
  const blogT = useTranslations("blog");
  const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(blogPost.image);
  const publishedDate = blogPost.publishedAt
    ? new Date(blogPost.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className={twMerge("w-full", className)}>
      {/* Image */}
      <figure
        className={twMerge(
          "relative w-full aspect-2/1 overflow-hidden rounded-3xl border-2",
          "border-gray-100 bg-white shadow-lg shadow-gray-100/50",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-gray-200/50",
        )}
      >
        {imageUrl ? (
          <Image
            className="object-cover"
            src={imageUrl}
            alt={imageAlt}
            fill={true}
            sizes="(max-width: 1100px) 100vw, 768px"
            priority={true}
          />
        ) : (
          <div
            className={twMerge(
              "absolute inset-0",
              "bg-linear-to-br from-primary/10 to-primary/5",
            )}
          />
        )}
      </figure>

      {/* Content */}
      <div className={twMerge("flex flex-col gap-6 p-6", "de:p-8", "lg:p-10")}>
        {/* Blog post meta information */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Published at */}
          {publishedDate && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-[14px] font-medium text-primary">
                {publishedDate}
              </span>
            </div>
          )}

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span className="text-[14px] text-gray-600">
              {blogPost.minRead} {blogT("minRead")}
            </span>
          </div>
        </div>

        {/* Blog post content */}
        {renderedContent}

        {/* Published at footer */}
        {publishedDate && (
          <div
            className={twMerge(
              "pt-6 mt-6 text-[14px] text-gray-500 border-t-2 border-gray-100",
            )}
          >
            {blogT("publishedAt")}{" "}
            <span className="font-medium text-dark">{publishedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostClient;
