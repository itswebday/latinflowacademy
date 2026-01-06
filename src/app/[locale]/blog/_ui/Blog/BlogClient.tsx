"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";

type BlogClientProps = {
  className?: string;
  blogPosts: Config["collections"]["blog-posts"][];
};

const BlogClient: React.FC<BlogClientProps> = ({ className, blogPosts }) => {
  const locale = useLocale() as LocaleOption;
  const blogT = useTranslations("blog");

  return (
    <div
      className={twMerge(
        "grid grid-cols-1 gap-6",
        "xs:grid-cols-2",
        "de:gap-8",
        "lg:grid-cols-3",
        className,
      )}
    >
      {blogPosts.map((post, index) => {
        const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(post.image);
        const formattedDate = post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null;
        const url = post.url || "#";

        return (
          <div className="group" key={index}>
            <Link href={url} prefetch={true}>
              <div
                className={twMerge(
                  "overflow-hidden rounded-2xl border-2 border-gray-100",
                  "bg-white transition-all duration-300",
                  "hover:border-primary/30 hover:shadow-xl",
                  "hover:shadow-primary/10 hover:-translate-y-1",
                )}
              >
                {/* Image */}
                {imageUrl && (
                  <figure
                    className={twMerge(
                      "relative w-full aspect-2/1 overflow-hidden bg-gray-100",
                    )}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        className={twMerge(
                          "object-cover transition-transform duration-500",
                          "group-hover:scale-110",
                        )}
                        src={imageUrl}
                        alt={imageAlt}
                        fill={true}
                        sizes={
                          "(max-width: 550px) 100vw, (max-width: 900px) " +
                          "50vw, 33vw"
                        }
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                      <div
                        className={twMerge(
                          "absolute inset-0 bg-linear-to-t from-black/20",
                          "via-transparent to-transparent opacity-0",
                          "transition-opacity duration-300",
                          "group-hover:opacity-100",
                        )}
                      />
                    </motion.div>
                  </figure>
                )}

                {/* Content */}
                <div
                  className={twMerge(
                    "flex flex-col gap-4 px-6 py-6",
                    "de:px-8 de:py-7",
                  )}
                >
                  {/* Published at */}
                  {formattedDate && (
                    <div
                      className={twMerge(
                        "text-[14px] font-medium text-primary",
                      )}
                    >
                      {formattedDate}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={twMerge(
                      "text-[20px] font-bold text-dark line-clamp-2",
                      "transition-colors duration-300",
                      "group-hover:text-primary",
                      "de:text-[24px]",
                    )}
                  >
                    {post.title}
                  </h3>

                  {/* Description */}
                  {post.meta?.description && (
                    <p
                      className={twMerge(
                        "text-[14px] text-dark/70 line-clamp-3 leading-relaxed",
                        "de:text-[16px]",
                      )}
                    >
                      {post.meta.description}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={twMerge(
                        "text-[14px] font-semibold text-primary",
                        "transition-all duration-300",
                      )}
                    >
                      {blogT("readMore")}
                    </span>
                    <motion.svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BlogClient;
