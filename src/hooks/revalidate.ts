"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  TypeWithID,
} from "payload";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { LocaleOption } from "@/types";
import type { Page } from "@/payload-types";

type BlogPost = TypeWithID & {
  _status?: "draft" | "published" | null;
  url?: string | string[] | null;
  slug?: string | string[] | null;
};

// Extract base path
const extractBasePath = (
  url: string | string[] | null | undefined,
): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  for (const locale of LOCALES) {
    if (locale !== DEFAULT_LOCALE && url.startsWith(`/${locale}/`)) {
      return url.slice(`/${locale}`.length);
    } else if (locale !== DEFAULT_LOCALE && url === `/${locale}`) {
      return "/";
    }
  }

  return url;
};

// Generate localized paths
const generateLocalizedPaths = (basePath: string): string[] => {
  return [
    basePath,
    ...LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => `/${locale}${basePath === "/" ? "" : basePath}`,
    ),
  ];
};

// Create global revalidate hook
const createGlobalRevalidateHook = (
  globalSlug?: string,
): GlobalAfterChangeHook => {
  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      const docUrl =
        typeof doc === "object" && doc !== null && "url" in doc && doc.url
          ? doc.url
          : null;

      if (docUrl && typeof docUrl === "string") {
        const basePath = extractBasePath(docUrl);

        if (basePath) {
          const paths = generateLocalizedPaths(basePath);

          if (doc._status === "published") {
            paths.forEach((path) => {
              revalidatePath(path);
            });
          }

          if (
            previousDoc?._status === "published" &&
            doc._status !== "published"
          ) {
            paths.forEach((path) => {
              revalidatePath(path);
            });
          }
        }
      }

      // Revalidate cache tags for all locales
      if (globalSlug) {
        LOCALES.forEach((locale) => {
          revalidateTag(`global_${globalSlug}_${locale}`, "max");
        });
      }
    }

    return doc;
  };
};

// Create collection revalidate hook
const createCollectionRevalidateHook = <
  T extends TypeWithID & {
    url?: string | string[] | null;
    _status?: "draft" | "published" | null;
  },
>(
  getAdditionalPaths?: (url: string | null) => string[],
): CollectionAfterChangeHook<T> => {
  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      // Check if URL changed
      const urlChanged =
        previousDoc?.url &&
        doc.url &&
        typeof previousDoc.url === "string" &&
        typeof doc.url === "string" &&
        previousDoc.url !== doc.url;

      // Revalidate new URL if page is published
      if (doc._status === "published") {
        if (doc.url && typeof doc.url === "string") {
          const basePath = extractBasePath(doc.url);

          if (basePath) {
            const paths = generateLocalizedPaths(basePath);

            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            revalidatePath(doc.url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(doc.url);

            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate old URL if it changed and was published
      if (urlChanged && previousDoc?._status === "published") {
        if (previousDoc.url && typeof previousDoc.url === "string") {
          const basePath = extractBasePath(previousDoc.url);

          if (basePath) {
            const paths = generateLocalizedPaths(basePath);

            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            revalidatePath(previousDoc.url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(previousDoc.url);

            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate when page status changes from published to draft
      if (previousDoc?._status === "published" && doc._status !== "published") {
        if (previousDoc.url && typeof previousDoc.url === "string") {
          const basePath = extractBasePath(previousDoc.url);

          if (basePath) {
            const paths = generateLocalizedPaths(basePath);

            paths.forEach((path) => {
              revalidatePath(path);
            });
          } else {
            revalidatePath(previousDoc.url);
          }

          if (getAdditionalPaths) {
            const additionalPaths = getAdditionalPaths(previousDoc.url);

            additionalPaths.forEach((additionalPath) => {
              revalidatePath(additionalPath);
            });
          }

          // Revalidate sitemap when content changes
          revalidateTag("sitemap", "max");
        }
      }

      // Revalidate homepage when any page URL changes
      if (urlChanged && doc._status === "published") {
        const homepagePaths = generateLocalizedPaths("/");

        homepagePaths.forEach((path) => {
          revalidatePath(path);
        });
      }
    }
    return doc;
  };
};

// Create collection delete hook
const createCollectionDeleteHook = <
  T extends TypeWithID & { url?: string | string[] | null },
>(
  getAdditionalPaths?: (url: string | null) => string[],
): CollectionAfterDeleteHook<T> => {
  return ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      if (doc?.url && typeof doc?.url === "string") {
        const basePath = extractBasePath(doc.url);

        if (basePath) {
          const paths = generateLocalizedPaths(basePath);

          paths.forEach((path) => {
            revalidatePath(path);
          });
        } else {
          revalidatePath(doc.url);
        }

        if (getAdditionalPaths) {
          const additionalPaths = getAdditionalPaths(doc.url);

          additionalPaths.forEach((additionalPath) => {
            revalidatePath(additionalPath);
          });
        }

        // Revalidate sitemap when content is deleted
        revalidateTag("sitemap", "max");
      }
    }

    return doc;
  };
};

// Revalidate homepage
export const revalidateHomepage = createGlobalRevalidateHook();

// Revalidate blog
export const revalidateBlog = createGlobalRevalidateHook();

// Revalidate privacy policy
export const revalidatePrivacyPolicy = createGlobalRevalidateHook();

// Revalidate cookie policy
export const revalidateCookiePolicy = createGlobalRevalidateHook();

// Revalidate terms and conditions
export const revalidateTermsAndConditions = createGlobalRevalidateHook();

// Revalidate news
export const revalidateNews = createGlobalRevalidateHook("news");

// Revalidate dance styles
export const revalidateDanceStyles = createGlobalRevalidateHook("dance-styles");

// Revalidate teachers
export const revalidateTeachers = createGlobalRevalidateHook("teachers");

// Revalidate navigation
export const revalidateNavigation: GlobalAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    await revalidateNavigationAndFooter();
  }

  return doc;
};

// Revalidate footer
export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    await revalidateNavigationAndFooter();
  }

  return doc;
};

// Get blog listing paths
const getBlogListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/blog")) {
    return [];
  }

  return generateLocalizedPaths("/blog");
};

// Helper to revalidate sitemap
const revalidateSitemap = () => {
  revalidateTag("sitemap", "max");
};

// Helper to get href from messages
const getHrefFromMessages = async (
  locale: string,
  messageKey: string,
): Promise<string> => {
  try {
    const messages = await import(`@/messages/${locale}.json`);
    const keyParts = messageKey.split(".");
    let value: unknown = messages.default;

    for (const part of keyParts) {
      if (typeof value === "object" && value !== null && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        const defaultMessages = await import(
          `@/messages/${DEFAULT_LOCALE}.json`
        );
        let defaultValue: unknown = defaultMessages.default;

        for (const defaultPart of keyParts) {
          if (
            typeof defaultValue === "object" &&
            defaultValue !== null &&
            defaultPart in defaultValue
          ) {
            defaultValue = (defaultValue as Record<string, unknown>)[
              defaultPart
            ];
          } else {
            return "";
          }
        }
        return typeof defaultValue === "string" ? defaultValue : "";
      }
    }

    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
};

// Helper to revalidate navigation and footer (used on all pages)
const revalidateNavigationAndFooter = async () => {
  const { getCachedPayload } = await import("@/utils/payload");
  const payload = await getCachedPayload();

  // Get paths from messages for all locales
  const pathsToRevalidate: string[] = [];

  for (const locale of LOCALES) {
    const [
      homeHref,
      blogHref,
      newsHref,
      danceStylesHref,
      teachersHref,
      privacyPolicyHref,
      cookiePolicyHref,
      termsAndConditionsHref,
    ] = await Promise.all([
      getHrefFromMessages(locale, "home.url"),
      getHrefFromMessages(locale, "blog.url"),
      getHrefFromMessages(locale, "news.url"),
      getHrefFromMessages(locale, "danceStyles.url"),
      getHrefFromMessages(locale, "teachers.url"),
      getHrefFromMessages(locale, "privacyPolicy.url"),
      getHrefFromMessages(locale, "cookiePolicy.url"),
      getHrefFromMessages(locale, "termsAndConditions.url"),
    ]);

    if (homeHref) pathsToRevalidate.push(homeHref);
    if (blogHref) pathsToRevalidate.push(blogHref);
    if (newsHref) pathsToRevalidate.push(newsHref);
    if (danceStylesHref) pathsToRevalidate.push(danceStylesHref);
    if (teachersHref) pathsToRevalidate.push(teachersHref);
    if (privacyPolicyHref) pathsToRevalidate.push(privacyPolicyHref);
    if (cookiePolicyHref) pathsToRevalidate.push(cookiePolicyHref);
    if (termsAndConditionsHref) pathsToRevalidate.push(termsAndConditionsHref);
  }

  pathsToRevalidate.forEach((path) => {
    revalidatePath(path);
  });

  // Fetch and revalidate all published pages for all locales
  for (const locale of LOCALES) {
    const results = await payload.find({
      collection: "pages",
      overrideAccess: true,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: locale as LocaleOption,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        url: true,
      },
    });

    results.docs?.forEach((page) => {
      if (page.url && typeof page.url === "string") {
        const basePath = extractBasePath(page.url);

        if (basePath) {
          const paths = generateLocalizedPaths(basePath);

          paths.forEach((path) => {
            revalidatePath(path);
          });
        } else {
          revalidatePath(page.url);
        }
      }
    });
  }

  // Fetch and revalidate all published blog posts for all locales
  for (const locale of LOCALES) {
    const blogHref = await getHrefFromMessages(locale, "blog.url");

    if (!blogHref) {
      continue;
    }

    const results = await payload.find({
      collection: "blog-posts",
      overrideAccess: true,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: locale as LocaleOption,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
      },
    });

    results.docs?.forEach((post) => {
      if (post.slug && typeof post.slug === "string") {
        const blogPostPath = `${blogHref}/${post.slug}`;
        revalidatePath(blogPostPath);
      }
    });
  }

  // Fetch and revalidate all published news posts for all locales
  for (const locale of LOCALES) {
    const newsHref = await getHrefFromMessages(locale, "news.url");

    if (!newsHref) {
      continue;
    }

    const results = await payload.find({
      collection: "news-posts",
      overrideAccess: true,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: locale as LocaleOption,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
      },
    });

    results.docs?.forEach((post) => {
      if (post.slug && typeof post.slug === "string") {
        const newsPostPath = `${newsHref}/${post.slug}`;
        revalidatePath(newsPostPath);
      }
    });
  }

  // Fetch and revalidate all published dance styles posts for all locales
  for (const locale of LOCALES) {
    const danceStylesHref = await getHrefFromMessages(
      locale,
      "danceStyles.url",
    );

    if (!danceStylesHref) {
      continue;
    }

    const results = await payload.find({
      collection: "dance-styles-posts",
      overrideAccess: true,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: locale as LocaleOption,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
      },
    });

    results.docs?.forEach((post) => {
      if (post.slug && typeof post.slug === "string") {
        const danceStylePostPath = `${danceStylesHref}/${post.slug}`;
        revalidatePath(danceStylePostPath);
      }
    });
  }

  // Fetch and revalidate all published teachers posts for all locales
  for (const locale of LOCALES) {
    const teachersHref = await getHrefFromMessages(locale, "teachers.url");

    if (!teachersHref) {
      continue;
    }

    const results = await payload.find({
      collection: "teachers-posts",
      overrideAccess: true,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: locale as LocaleOption,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
      },
    });

    results.docs?.forEach((post) => {
      if (post.slug && typeof post.slug === "string") {
        const teacherPostPath = `${teachersHref}/${post.slug}`;
        revalidatePath(teacherPostPath);
      }
    });
  }

  // Also revalidate with tags for cache invalidation
  revalidateTag("navigation", "max");
  revalidateTag("footer", "max");
};

export const revalidatePage: CollectionAfterChangeHook<Page> = async (args) => {
  if (!args.req.context.disableRevalidate) {
    const baseHook = createCollectionRevalidateHook<Page>();
    return baseHook(args);
  }

  return args.doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> =
  createCollectionDeleteHook<Page>();

// Custom hook for blog posts that also revalidates sitemap
export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook =
      createCollectionRevalidateHook<BlogPost>(getBlogListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content changes
    if (doc._status === "published" || previousDoc?._status === "published") {
      revalidateSitemap();
    }

    return result;
  }

  return doc;
};

// Custom hook for blog post deletion that also revalidates sitemap
export const revalidateBlogPostDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(getBlogListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }

  return doc;
};

// Get news listing paths
const getNewsListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/news")) {
    return [];
  }

  return generateLocalizedPaths("/news");
};

// Custom hook for news posts that also revalidates sitemap
export const revalidateNewsPost: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook =
      createCollectionRevalidateHook<BlogPost>(getNewsListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content changes
    if (doc._status === "published" || previousDoc?._status === "published") {
      revalidateSitemap();
    }

    return result;
  }

  return doc;
};

// Custom hook for news post deletion that also revalidates sitemap
export const revalidateNewsPostDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(getNewsListingPaths);
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }

  return doc;
};

// Get dance style pages listing paths
const getDanceStylePagesListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/dance-styles")) {
    return [];
  }

  return generateLocalizedPaths("/dance-styles");
};

// Custom hook for dance style pages that also revalidates sitemap
export const revalidateDanceStyle: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionRevalidateHook<BlogPost>(
      getDanceStylePagesListingPaths,
    );
    const result = baseHook(args);

    // Revalidate sitemap when content changes
    if (doc._status === "published" || previousDoc?._status === "published") {
      revalidateSitemap();
    }

    return result;
  }

  return doc;
};

// Custom hook for dance style page deletion that also revalidates sitemap
export const revalidateDanceStyleDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(
      getDanceStylePagesListingPaths,
    );
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }

  return doc;
};

// Get teacher pages listing paths
const getTeacherPagesListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/teachers")) {
    return [];
  }

  return generateLocalizedPaths("/teachers");
};

// Custom hook for teacher pages that also revalidates sitemap
export const revalidateTeacher: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionRevalidateHook<BlogPost>(
      getTeacherPagesListingPaths,
    );
    const result = baseHook(args);

    // Revalidate sitemap when content changes
    if (doc._status === "published" || previousDoc?._status === "published") {
      revalidateSitemap();
    }

    return result;
  }

  return doc;
};

// Custom hook for teacher page deletion that also revalidates sitemap
export const revalidateTeacherDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(
      getTeacherPagesListingPaths,
    );
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }

  return doc;
};
