import React from "react";
import { twMerge } from "tailwind-merge";
import { BackgroundImage, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { StoryBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import {
  applyHighlightsToRichText,
  getMediaUrlAndAlt,
  getPaddingClasses,
  highlightText,
} from "@/utils";

const Story: React.FC<StoryBlock & { id?: string; globals: Globals }> = ({
  heading,
  text,
  blueTexts,
  redTexts,
  pictures,
  quote,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  const hasHighlights = (blueTexts?.length || redTexts?.length) ?? false;
  let processedRichText: RichText | null | undefined = text;

  if (processedRichText && hasHighlights) {
    if (blueTexts?.length) {
      const result = applyHighlightsToRichText(
        processedRichText as RichText,
        blueTexts,
        "font-semibold text-nowrap text-blue",
      );
      processedRichText =
        typeof result === "object" && "root" in result
          ? result
          : processedRichText;
    }

    if (redTexts?.length) {
      const result = applyHighlightsToRichText(
        processedRichText as RichText,
        redTexts,
        "font-semibold text-nowrap text-red",
      );
      processedRichText =
        typeof result === "object" && "root" in result
          ? result
          : processedRichText;
    }
  }

  return (
    <section
      id={id}
      className={twMerge(
        "relative flex flex-col items-center gap-12",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Header */}
      {heading && (
        <header className="w-11/12 max-w-3xl mx-auto">
          <HeadingWithIcon
            className="justify-center text-center"
            icon={heading.icon}
          >
            <h1 className="font-bold text-dark justify-center text-center">
              {typeof heading.text === "string" && heading.hlTexts
                ? highlightText(heading.text, heading.hlTexts)
                : heading.text}
            </h1>
          </HeadingWithIcon>
        </header>
      )}

      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col items-center gap-8 w-11/12 max-w-5xl mx-auto",
          "text-[18px]",
          "de:flex-row-reverse",
        )}
      >
        {/* Images and quote */}
        <div
          className={twMerge("flex flex-col items-center gap-12", "de:w-1/2")}
        >
          {/* Images */}
          {pictures && pictures.length > 0 && (
            <div className="relative w-64 h-36">
              {pictures.map((picture, index) => {
                const { url: imageUrl, alt: imageAlt } = picture.image
                  ? getMediaUrlAndAlt(picture.image)
                  : { url: undefined, alt: undefined };

                if (!imageUrl) {
                  return null;
                }

                return (
                  <figure
                    className={twMerge(
                      "absolute top-0 w-36 h-36 border-primary",
                      "rounded-full border-4 overflow-hidden",
                      index === 0 && "left-0",
                      index === 1 && "right-0",
                      index === 2 &&
                        "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
                    )}
                    key={index}
                  >
                    <BackgroundImage
                      src={imageUrl}
                      alt={imageAlt || `Story image ${index + 1}`}
                    />
                  </figure>
                );
              })}
            </div>
          )}

          {/* Quote */}
          {quote && (
            <div className="pl-4 border-l-4 border-l-primary w-5/6">
              <p className="text-[18px] font-bold italic">{`"${quote}"`}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <RichTextRenderer
          className={twMerge(
            "flex flex-col gap-8 w-5/6 text-[16px]",
            "de:w-1/2",
          )}
          richText={processedRichText as RichText}
        />
      </div>
    </section>
  );
};

export default Story;
