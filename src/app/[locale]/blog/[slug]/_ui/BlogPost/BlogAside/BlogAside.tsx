"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";

type BlogAsideProps = {
  className?: string;
  blogPosts: Config["collections"]["blog-posts"][];
};

const BlogAside: React.FC<BlogAsideProps> = ({ className, blogPosts }) => {
  const locale = useLocale() as LocaleOption;
  const blogT = useTranslations("blog");

  return (
    <nav
      className={twMerge(
        "rounded-3xl border-2 border-gray-100 px-6 py-8 bg-white",
        "shadow-lg shadow-gray-100/50 transition-all duration-300",
        "hover:shadow-xl hover:shadow-gray-200/50",
        className,
      )}
    >
      {/* Header */}
      <header
        className={twMerge(
          "flex flex-col gap-2 mb-6 pb-6 border-b-2 border-gray-100",
        )}
      >
        {/* Heading */}
        <h5 className="text-[20px] font-bold text-dark">
          {blogT("otherPosts.heading")}
        </h5>

        {/* Paragraph */}
        <p className="text-[14px] text-dark/70">
          {blogT("otherPosts.paragraph")}
        </p>
      </header>

      {/* Blog posts */}
      {blogPosts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {blogPosts.map((post, index) => {
            const { url: imageURL, alt: imageAlt } = getMediaUrlAndAlt(
              post.image,
            );
            const publishedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;
            const url = post.url || "#";

            return (
              <div key={index}>
                <Link
                  className={twMerge(
                    "block rounded-xl border-2 border-transparent p-4",
                    "transition-all duration-300 group hover:border-primary/30",
                    "hover:bg-primary/5 hover:shadow-md",
                  )}
                  href={url}
                  prefetch={true}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <figure
                      className={twMerge(
                        "relative w-20 h-20 shrink-0 overflow-hidden",
                        "rounded-xl border-2 border-gray-100",
                        "transition-all duration-300",
                        "group-hover:border-primary/50",
                      )}
                    >
                      {imageURL ? (
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-300",
                            "group-hover:scale-110",
                          )}
                          src={imageURL}
                          alt={imageAlt || post.title}
                          fill={true}
                          sizes="80px"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={twMerge(
                            "absolute inset-0",
                            "bg-linear-to-br from-gray-200 to-gray-300",
                          )}
                        />
                      )}
                    </figure>

                    {/* Content */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {/* Title */}
                      <h5
                        className={twMerge(
                          "text-[14px] font-semibold text-dark line-clamp-2",
                          "transition-colors duration-300",
                          "group-hover:text-primary",
                        )}
                      >
                        {post.title}
                      </h5>

                      {/* Published at */}
                      {publishedDate && (
                        <p
                          className={twMerge(
                            "text-[12px] font-medium text-primary",
                          )}
                        >
                          {publishedDate}
                        </p>
                      )}

                      {/* Reading time */}
                      <p className="text-[12px] text-gray-500">
                        {post.minRead} {blogT("minRead")}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-dark/60 text-center">{blogT("noPosts")}</p>
      )}
    </nav>
  );
};

export default BlogAside;
