import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import BlogPostClient from "./BlogPostClient";
import BlogAside from "./BlogAside";

type BlogPostProps = {
  blogPost: Config["collections"]["blog-posts"];
  allBlogPosts: Config["collections"]["blog-posts"][];
};

const BlogPost = async ({ blogPost, allBlogPosts }: BlogPostProps) => {
  // Rendered content
  const renderedContent = (
    <RichTextRenderer className="leading-relaxed" richText={blogPost.content} />
  );

  // Filter other blog posts for aside component
  const otherBlogPosts = allBlogPosts
    .filter((post) => post.slug !== blogPost.slug)
    .slice(0, 3);

  return (
    <section className={twMerge("w-full py-12", "de:py-20")}>
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-8 w-11/12 max-w-7xl mx-auto",
          "me:flex-row me:gap-12",
        )}
      >
        {/* Blog post */}
        <article className="flex-1">
          <BlogPostClient
            className={twMerge(
              "w-full overflow-hidden rounded-3xl border-2 border-gray-100",
              "bg-white shadow-lg shadow-gray-100/50 transition-all",
              "duration-300 hover:shadow-xl hover:shadow-gray-200/50",
            )}
            blogPost={blogPost}
            renderedContent={renderedContent}
          />
        </article>

        {/* Other blog posts */}
        <aside className="w-full h-fit max-w-120 mx-auto shrink-0 me:w-100">
          <BlogAside blogPosts={otherBlogPosts} />
        </aside>
      </div>
    </section>
  );
};

export default BlogPost;
