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

  // Only use the field that matches the current urlType
  let pageValue: unknown = null;

  if (rawUrl.urlType === "page") {
    pageValue = rawUrl.page?.value;
  } else if (rawUrl.urlType === "blog-post") {
    pageValue = rawUrl.blogPost?.value;
  } else if (rawUrl.urlType === "event-post") {
    pageValue = rawUrl.eventPost?.value;
  }

  if (pageValue && typeof pageValue === "object" && "url" in pageValue) {
    const url = pageValue.url;

    return typeof url === "string" ? url : "";
  }

  return "";
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

export const processText = (
  text: string | RichText,
  highlightClassName?: string,
): React.ReactNode => {
  const highlightMarker = "==";

  if (typeof text === "string") {
    // Process string for highlight markers (==text==) and line breaks
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;

    const processTextSegment = (segment: string): React.ReactNode[] => {
      const segmentParts: React.ReactNode[] = [];
      let segmentLastIndex = 0;

      while (segmentLastIndex < segment.length) {
        const startIndex = segment.indexOf(highlightMarker, segmentLastIndex);

        // No more markers, add the rest of the text
        if (startIndex === -1) {
          if (segmentLastIndex < segment.length) {
            segmentParts.push(segment.substring(segmentLastIndex));
          }

          break;
        }

        // Add text before the marker
        if (startIndex > segmentLastIndex) {
          segmentParts.push(segment.substring(segmentLastIndex, startIndex));
        }

        // Find the closing marker
        const endIndex = segment.indexOf(
          highlightMarker,
          startIndex + highlightMarker.length,
        );

        // No closing marker found
        if (endIndex === -1) {
          segmentParts.push(segment.substring(startIndex));

          break;
        }

        // Extract the highlighted text
        const highlightedText = segment.substring(
          startIndex + highlightMarker.length,
          endIndex,
        );

        // Add highlighted span
        segmentParts.push(
          React.createElement(
            "span",
            {
              className: twMerge(
                "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
                highlightClassName,
              ),
              key: `highlight-${keyCounter++}`,
            },
            highlightedText,
          ),
        );

        segmentLastIndex = endIndex + highlightMarker.length;
      }

      return segmentParts;
    };

    // Split by line breaks and process each segment
    const lines = text.split("\n");

    lines.forEach((line, lineIndex) => {
      // Process highlights in this line
      const lineParts = processTextSegment(line);

      // Add line parts
      parts.push(...lineParts);

      // Add line break (except after the last line)
      if (lineIndex < lines.length - 1) {
        parts.push(React.createElement("br", { key: `br-${keyCounter++}` }));
      }
    });

    return parts.length === 0 ? text : parts.length === 1 ? parts[0] : parts;
  }

  // If it's RichText, process it to find and highlight text nodes
  if (!text?.root?.children) {
    return "";
  }

  let keyCounter = 0;

  const processNode = (
    node: BlockNode,
  ): React.ReactNode | React.ReactNode[] => {
    // Check if this is a text node that should be highlighted
    if (node.type === "text") {
      const textContent = node.text || "";

      // Process text for highlights and line breaks
      const processTextContent = (content: string): React.ReactNode[] => {
        const contentParts: React.ReactNode[] = [];
        let contentLastIndex = 0;

        // First, split by line breaks
        const lines = content.split("\n");

        lines.forEach((line, lineIndex) => {
          // Process highlights in this line
          let lineLastIndex = 0;

          while (lineLastIndex < line.length) {
            const startIndex = line.indexOf(highlightMarker, lineLastIndex);

            if (startIndex === -1) {
              if (lineLastIndex < line.length) {
                contentParts.push(line.substring(lineLastIndex));
              }
              break;
            }

            if (startIndex > lineLastIndex) {
              contentParts.push(line.substring(lineLastIndex, startIndex));
            }

            const endIndex = line.indexOf(
              highlightMarker,
              startIndex + highlightMarker.length,
            );

            if (endIndex === -1) {
              contentParts.push(line.substring(startIndex));
              break;
            }

            const highlightedText = line.substring(
              startIndex + highlightMarker.length,
              endIndex,
            );

            contentParts.push(
              React.createElement(
                "span",
                {
                  className: twMerge(
                    "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
                    highlightClassName,
                  ),
                  key: `highlight-${keyCounter++}`,
                },
                highlightedText,
              ),
            );

            lineLastIndex = endIndex + highlightMarker.length;
          }

          // Add line break (except after the last line)
          if (lineIndex < lines.length - 1) {
            contentParts.push(
              React.createElement("br", { key: `br-${keyCounter++}` }),
            );
          }
        });

        return contentParts;
      };

      // Check if the text contains highlight markers or line breaks
      if (textContent.includes(highlightMarker) || textContent.includes("\n")) {
        const parts = processTextContent(textContent);
        return parts.length === 1 ? parts[0] : parts;
      }

      // Also check for className property that might indicate highlighting
      const nodeClassName =
        "className" in node && typeof node.className === "string"
          ? node.className
          : undefined;

      if (
        nodeClassName &&
        (nodeClassName.includes("highlight") ||
          nodeClassName.includes("gradient"))
      ) {
        const key = `highlight-${keyCounter++}`;
        return React.createElement(
          "span",
          {
            className: twMerge(
              "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
              highlightClassName,
            ),
            key,
          },
          textContent,
        );
      }

      return textContent;
    }

    // For nodes with children, recursively process them
    if ("children" in node && Array.isArray(node.children)) {
      return node.children.map((child) => processNode(child));
    }

    return null;
  };

  const processedChildren = text.root.children
    .map((child) => processNode(child))
    .flat()
    .filter((node): node is React.ReactNode => node !== null);

  if (processedChildren.length === 0) {
    return "";
  }

  if (processedChildren.length === 1) {
    return processedChildren[0];
  }

  return processedChildren;
};
