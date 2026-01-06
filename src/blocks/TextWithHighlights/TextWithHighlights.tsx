import React from "react";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import type { TextWithHighlightsBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getPaddingClasses, highlightText } from "@/utils";

const TextWithHighlights: React.FC<
  TextWithHighlightsBlock & { id?: string; globals: Globals }
> = ({
  showSubheading,
  subheading,
  showHeading,
  heading,
  text,
  hlTexts,
  centered,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  const processedText =
    typeof text === "string" && hlTexts
      ? highlightText(text, hlTexts, "mx-1 text-[28px] font-bold")
      : text;

  return (
    <section
      id={id}
      className={twMerge(
        "relative flex flex-col items-center justify-center gap-24",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-3 w-11/12 max-w-3xl mx-auto",
          centered ? "items-center text-center" : "items-start text-left",
        )}
      >
        {/* Header */}
        {showSubheading ||
          (subheading && (
            <header
              className={twMerge(
                "flex flex-col gap-1",
                centered ? "items-center" : "items-start",
              )}
            >
              {/* Subheading */}
              {showSubheading && subheading && (
                <HeadingWithIcon
                  className={centered ? "justify-center" : undefined}
                  icon={subheading.icon}
                >
                  <h5 className="font-bold text-dark">
                    {typeof subheading.text === "string" && subheading.hlTexts
                      ? highlightText(subheading.text, subheading.hlTexts)
                      : subheading.text}
                  </h5>
                </HeadingWithIcon>
              )}

              {/* Heading */}
              {showHeading && heading && (
                <HeadingWithIcon
                  className={centered ? "justify-center" : undefined}
                  icon={heading.icon}
                >
                  <h1 className="font-bold text-dark">
                    {typeof heading.text === "string" && heading.hlTexts
                      ? highlightText(heading.text, heading.hlTexts)
                      : heading.text}
                  </h1>
                </HeadingWithIcon>
              )}
            </header>
          ))}

        {/* Text */}
        {processedText && (
          <p className="uppercase leading-8">{processedText}</p>
        )}
      </div>
    </section>
  );
};

export default TextWithHighlights;
