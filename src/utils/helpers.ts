import React from "react";
import { twMerge } from "tailwind-merge";
import type { BlockNode, Globals, RawUrl, RichText } from "@/types";

export const getMediaUrlAndAlt = (
  media:
    | {
        url?: string | null;
        alt?: string | null;
      }
    | string
    | number
    | null
    | undefined,
) => {
  if (!media || typeof media === "string" || typeof media === "number") {
    return { url: "", alt: "" };
  }

  // Get the URL of the media
  const url = media.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${media.url}`
    : "";

  // Get the alt text of the media
  const alt = media.alt || "";

  // Return the URL and alt text
  return { url, alt };
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const createLinkClickHandler = (
  href: string | undefined,
  pathname: string,
  options?: {
    onNavigate?: () => void;
    onClick?: () => void;
  },
) => {
  return (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>,
  ) => {
    if (!href) {
      if (options?.onClick) {
        options.onClick();
      }
      return;
    }

    // Normalize pathname (remove any hash that might be in the URL)
    const normalizedPathname =
      pathname === "/" ? "/" : pathname.split("#")[0].replace(/\/$/, "");

    // Handle hash-only links (scroll on current page)
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetElement = document.querySelector(href);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    } else if (href.includes("#")) {
      // Handle links with hash (page#target)
      const [pageUrl, hash] = href.split("#");
      const hashTarget = hash ? `#${hash}` : "";

      // Normalize page URL for comparison (remove trailing slashes)
      const normalizedPageUrl =
        pageUrl === "/" ? "/" : pageUrl.replace(/\/$/, "");

      // If already on the target page, prevent navigation and just scroll
      if (normalizedPageUrl === normalizedPathname) {
        e.preventDefault();

        const targetElement = document.querySelector(hashTarget);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        }
      } else {
        // Navigate to the page - Next.js will handle scrolling to hash on load
        if (options?.onNavigate) {
          options.onNavigate();
        }
      }
    } else {
      // Regular link navigation (no hash in href)
      const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "");

      // If it is the same page, scroll to top
      if (normalizedHref === normalizedPathname) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        if (options?.onNavigate) {
          options.onNavigate();
        }
      } else {
        // If it is a different page, ensure we navigate cleanly without hash
        if (typeof window !== "undefined" && window.location.hash) {
          const urlWithoutHash =
            window.location.pathname + window.location.search;

          window.history.replaceState(null, "", urlWithoutHash);
        }

        // Handle navigation normally
        if (options?.onNavigate) {
          options.onNavigate();
        }
      }
    }

    // Handle click event
    if (options?.onClick) {
      options.onClick();
    }
  };
};

export const getGlobalUrl = (global: unknown): string | null => {
  if (
    typeof global === "object" &&
    global !== null &&
    "url" in global &&
    global.url
  ) {
    if (global.url && typeof global.url === "string") {
      return global.url;
    }
  }

  return null;
};

export const getUrl = (rawUrl: RawUrl, globals: Globals): string => {
  const getFromGlobal = (selector: (global: Globals) => unknown): string => {
    const value = selector(globals);

    return getGlobalUrl(value) || "";
  };

  if (rawUrl.custom) {
    return rawUrl.url;
  }

  if (rawUrl.scroll) {
    if (rawUrl.targetPage === "home" || rawUrl.targetPage === "page") {
      if (rawUrl.targetPage === "home") {
        const homeUrl = getFromGlobal((global) => global.home);

        return homeUrl
          ? `${homeUrl}${rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : ""}`
          : `#${rawUrl.scrollTarget || "top"}`;
      } else if (rawUrl.targetPage === "page" && rawUrl.page) {
        const pageValue = rawUrl.page?.value;
        const pageUrl =
          typeof pageValue === "object" &&
          pageValue !== null &&
          "url" in pageValue
            ? pageValue.url || ""
            : "";

        return pageUrl
          ? `${pageUrl}${rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : ""}`
          : `#${rawUrl.scrollTarget || "top"}`;
      }
    }

    return rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : "#top";
  }

  if (rawUrl.urlType === "home") {
    return getFromGlobal((global) => global.home);
  }

  if (rawUrl.urlType === "blog") {
    return getFromGlobal((global) => global.blog);
  }

  if (rawUrl.urlType === "events") {
    return getFromGlobal((global) => global.events);
  }

  if (rawUrl.urlType === "privacy-policy") {
    return getFromGlobal((global) => global.privacyPolicy);
  }

  if (rawUrl.urlType === "cookie-policy") {
    return getFromGlobal((global) => global.cookiePolicy);
  }

  if (rawUrl.urlType === "terms-and-conditions") {
    return getFromGlobal((global) => global.termsAndConditions);
  }

  const pageValue =
    rawUrl.page?.value || rawUrl.blogPost?.value || rawUrl.eventPost?.value;
  const pageUrl =
    typeof pageValue === "object" && pageValue !== null && "url" in pageValue
      ? pageValue.url || ""
      : "";

  return pageUrl;
};

export const getMimeType = (media: unknown): string | null => {
  if (!media || typeof media !== "object") {
    return null;
  }

  if ("mimeType" in media && typeof media.mimeType === "string") {
    return media.mimeType;
  }

  if ("value" in media && typeof media.value === "object" && media.value) {
    return getMimeType(media.value);
  }

  return null;
};

const extractTextFromRichText = (richText: RichText): string => {
  const extractFromNode = (node: BlockNode): string => {
    if (node.type === "text" && node.text) {
      return node.text;
    }

    if ("children" in node && Array.isArray(node.children)) {
      return node.children.map(extractFromNode).join("");
    }

    return "";
  };

  if (!richText?.root?.children) {
    return "";
  }

  return richText.root.children.map(extractFromNode).join(" ");
};

export const highlightText = (
  text: string | RichText,
  highlightedTexts?: Array<{ text?: string | null }> | null,
  highlightClassName?: string,
): React.ReactNode[] => {
  const textString =
    typeof text === "string" ? text : extractTextFromRichText(text);

  if (!highlightedTexts || highlightedTexts.length === 0) {
    return [textString];
  }

  const parts: React.ReactNode[] = [];
  const sortedHighlights = highlightedTexts
    .map((h) => h.text)
    .filter((t): t is string => !!t)
    .sort((a, b) => b.length - a.length);
  const matches: Array<{ start: number; end: number; text: string }> = [];

  sortedHighlights.forEach((highlight) => {
    let searchIndex = 0;

    while (searchIndex < textString.length) {
      const index = textString
        .toLowerCase()
        .indexOf(highlight.toLowerCase(), searchIndex);

      if (index === -1) {
        break;
      }

      const overlaps = matches.some(
        (m) => !(index >= m.end || index + highlight.length <= m.start),
      );

      if (!overlaps) {
        matches.push({
          start: index,
          end: index + highlight.length,
          text: textString.substring(index, index + highlight.length),
        });
      }

      searchIndex = index + 1;
    }
  });

  let lastIndex = 0;

  matches.sort((a, b) => a.start - b.start);
  matches.forEach((match) => {
    if (match.start > lastIndex) {
      parts.push(textString.substring(lastIndex, match.start));
    }

    parts.push(
      React.createElement(
        "span",
        {
          className: twMerge(
            "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
            highlightClassName,
          ),
          key: `highlight-${match.start}`,
        },
        match.text,
      ),
    );

    lastIndex = match.end;
  });

  if (lastIndex < textString.length) {
    parts.push(textString.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [textString];
};

export const applyHighlightsToRichText = (
  text: string | RichText,
  highlightedTexts?: Array<{ text?: string | null }> | null,
  highlightClassName?: string,
): React.ReactNode[] | RichText => {
  if (!highlightedTexts?.length || !highlightClassName) {
    if (typeof text === "string") {
      return [text];
    }
    return text;
  }

  const highlights = highlightedTexts
    .map((ht) => ht.text)
    .filter((t): t is string => !!t);

  if (typeof text === "string") {
    const textString = text;
    const parts: React.ReactNode[] = [];
    const sortedHighlights = highlights.sort((a, b) => b.length - a.length);
    const matches: Array<{ start: number; end: number; text: string }> = [];

    sortedHighlights.forEach((highlight) => {
      let searchIndex = 0;

      while (searchIndex < textString.length) {
        const index = textString
          .toLowerCase()
          .indexOf(highlight.toLowerCase(), searchIndex);

        if (index === -1) {
          break;
        }

        const overlaps = matches.some(
          (m) => !(index >= m.end || index + highlight.length <= m.start),
        );

        if (!overlaps) {
          matches.push({
            start: index,
            end: index + highlight.length,
            text: textString.substring(index, index + highlight.length),
          });
        }

        searchIndex = index + 1;
      }
    });

    if (matches.length === 0) {
      return [textString];
    }

    let lastIndex = 0;

    matches.sort((a, b) => a.start - b.start);
    matches.forEach((match) => {
      if (match.start > lastIndex) {
        parts.push(textString.substring(lastIndex, match.start));
      }

      parts.push(
        React.createElement(
          "span",
          {
            className: highlightClassName,
            key: `highlight-${match.start}`,
          },
          match.text,
        ),
      );

      lastIndex = match.end;
    });

    if (lastIndex < textString.length) {
      parts.push(textString.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [textString];
  }

  // If input is RichText, process it
  const richText = text;

  const processNode = (node: unknown): unknown | unknown[] => {
    if (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "text" &&
      "text" in node &&
      typeof node.text === "string"
    ) {
      const textNode = node as {
        type: "text";
        text: string;
        [key: string]: unknown;
      };
      const text = textNode.text;
      const matches: Array<{
        start: number;
        end: number;
      }> = [];

      highlights.forEach((highlight) => {
        let searchIndex = 0;
        while (searchIndex < text.length) {
          const index = text
            .toLowerCase()
            .indexOf(highlight.toLowerCase(), searchIndex);
          if (index === -1) {
            break;
          }

          const overlaps = matches.some(
            (m) => !(index >= m.end || index + highlight.length <= m.start),
          );

          if (!overlaps) {
            matches.push({
              start: index,
              end: index + highlight.length,
            });
          }

          searchIndex = index + 1;
        }
      });

      if (matches.length === 0) {
        return node;
      }

      matches.sort((a, b) => a.start - b.start);

      const parts: Array<{
        type: "text";
        text: string;
        className?: string;
        [key: string]: unknown;
      }> = [];
      let lastIndex = 0;

      matches.forEach((match) => {
        if (match.start > lastIndex) {
          parts.push({
            ...textNode,
            text: text.substring(lastIndex, match.start),
          });
        }

        parts.push({
          ...textNode,
          text: text.substring(match.start, match.end),
          className: highlightClassName,
        });
        lastIndex = match.end;
      });

      if (lastIndex < text.length) {
        parts.push({
          ...textNode,
          text: text.substring(lastIndex),
        });
      }

      return parts;
    }

    if (
      typeof node === "object" &&
      node !== null &&
      "children" in node &&
      Array.isArray(node.children)
    ) {
      const processedChildren = node.children
        .map(processNode)
        .flat()
        .filter((child): child is unknown => child !== null);

      return {
        ...node,
        children: processedChildren,
      };
    }

    return node;
  };

  const processedChildren = richText.root.children
    .map(processNode)
    .flat()
    .filter((child): child is unknown => child !== null);

  return {
    ...richText,
    root: {
      ...richText.root,
      children: processedChildren as typeof richText.root.children,
    },
  };
};
