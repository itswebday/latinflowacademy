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

// Revalidate events
export const revalidateEvents = createGlobalRevalidateHook("events");

// Revalidate prices
export const revalidatePrices = createGlobalRevalidateHook("prices");

// Revalidate schedule
export const revalidateSchedule = createGlobalRevalidateHook("schedule");

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

// Helper to get url from messages
const getUrlFromMessages = async (
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
      homeUrl,
      blogUrl,
      eventsUrl,
      pricesUrl,
      privacyPolicyUrl,
      cookiePolicyUrl,
      termsAndConditionsUrl,
    ] = await Promise.all([
      getUrlFromMessages(locale, "home.url"),
      getUrlFromMessages(locale, "blog.url"),
      getUrlFromMessages(locale, "events.url"),
      getUrlFromMessages(locale, "prices.url"),
      getUrlFromMessages(locale, "privacyPolicy.url"),
      getUrlFromMessages(locale, "cookiePolicy.url"),
      getUrlFromMessages(locale, "termsAndConditions.url"),
    ]);

    if (homeUrl) pathsToRevalidate.push(homeUrl);
    if (blogUrl) pathsToRevalidate.push(blogUrl);
    if (eventsUrl) pathsToRevalidate.push(eventsUrl);
    if (pricesUrl) pathsToRevalidate.push(pricesUrl);
    if (privacyPolicyUrl) pathsToRevalidate.push(privacyPolicyUrl);
    if (cookiePolicyUrl) pathsToRevalidate.push(cookiePolicyUrl);
    if (termsAndConditionsUrl) pathsToRevalidate.push(termsAndConditionsUrl);
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
    const blogUrl = await getUrlFromMessages(locale, "blog.url");

    if (!blogUrl) {
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
        const blogPostPath = `${blogUrl}/${post.slug}`;
        revalidatePath(blogPostPath);
      }
    });
  }

  // Fetch and revalidate all published event posts for all locales
  for (const locale of LOCALES) {
    const eventsUrl = await getUrlFromMessages(locale, "events.url");

    if (!eventsUrl) {
      continue;
    }

    const results = await payload.find({
      collection: "events-posts",
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
        const eventPostPath = `${eventsUrl}/${post.slug}`;
        revalidatePath(eventPostPath);
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

// Get events listing paths
const getEventsListingPaths = (url: string | null): string[] => {
  if (!url) {
    return [];
  }

  const basePath = extractBasePath(url);

  if (!basePath || !basePath.startsWith("/events")) {
    return [];
  }

  return generateLocalizedPaths("/events");
};

// Custom hook for event posts that also revalidates sitemap
export const revalidateEventPost: CollectionAfterChangeHook<BlogPost> = async (
  args,
) => {
  const { doc, previousDoc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionRevalidateHook<BlogPost>(
      getEventsListingPaths,
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

// Custom hook for event post deletion that also revalidates sitemap
export const revalidateEventPostDelete: CollectionAfterDeleteHook<
  BlogPost
> = async (args) => {
  const { doc, req } = args;

  if (!req.context.disableRevalidate) {
    const baseHook = createCollectionDeleteHook<BlogPost>(
      getEventsListingPaths,
    );
    const result = baseHook(args);

    // Revalidate sitemap when content is deleted
    revalidateSitemap();

    return result;
  }

  return doc;
};
