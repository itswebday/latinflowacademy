import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import type { Config } from "@/payload-types";
import { processText } from "@/utils";
import BlogClient from "./BlogClient";

type BlogProps = {
  blog: Config["globals"]["blog"];
  blogPosts: Config["collections"]["blog-posts"][];
};

const Blog: React.FC<BlogProps> = async ({ blog, blogPosts }) => {
  const blogT = await getTranslations("blog");

  return (
    <section className="w-full py-12 de:py-20">
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col items-center gap-4",
          "w-11/12 max-w-7xl mx-auto",
        )}
      >
        {/* Heading */}
        <HeadingWithIcon icon={blog.heading.icon}>
          <h1 className="font-bold">{processText(blog.heading.text)}</h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-2xl mx-auto text-dark/70 text-center">
          {processText(blog.paragraph.text)}
        </p>

        {/* Blog posts */}
        {blogPosts.length === 0 ? (
          <p className="my-16 text-dark/60 text-center">{blogT("noPosts")}</p>
        ) : (
          <BlogClient className="mt-16" blogPosts={blogPosts} />
        )}
      </div>
    </section>
  );
};

export default Blog;
