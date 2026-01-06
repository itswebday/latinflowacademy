import React from "react";
import { twMerge } from "tailwind-merge";
import {
  ButtonLink,
  type ButtonLinkProps,
  HeadingWithIcon,
} from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { TextBlock } from "@/payload-types";
import type { Globals, RawUrl } from "@/types";
import { getPaddingClasses, getUrl, highlightText } from "@/utils";

const Text: React.FC<TextBlock & { id?: string; globals: Globals }> = (
  props,
) => {
  const {
    showSubheading,
    subheading,
    showHeading,
    heading,
    text,
    showButton,
    button,
    centered,
    width,
    background,
    paddingTop,
    paddingBottom,
    hidden,
    id,
    globals,
  } = props as TextBlock & {
    id?: string;
    globals: Globals;
    showButton?: boolean | null;
    button?: unknown;
  };
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;
  const getMaxWidthClass = () => {
    switch (width) {
      case "small":
        return "max-w-3xl";
      case "medium":
        return "max-w-5xl";
      case "large":
        return "max-w-7xl";
      default:
        return "max-w-5xl";
    }
  };

  // Subheading
  const subheadingElement =
    showSubheading && subheading ? (
      <HeadingWithIcon
        className={centered ? "justify-center" : undefined}
        icon={subheading.icon}
      >
        <h5
          className={twMerge(
            "font-bold text-dark",
            centered && "justify-center",
          )}
        >
          {typeof subheading.text === "string" && subheading.hlTexts
            ? highlightText(subheading.text, subheading.hlTexts)
            : subheading.text}
        </h5>
      </HeadingWithIcon>
    ) : null;

  // Heading
  const headingElement =
    showHeading && heading ? (
      <HeadingWithIcon
        className={centered ? "justify-center" : undefined}
        icon={heading.icon}
      >
        <h1
          className={twMerge(
            "font-bold text-dark",
            centered && "justify-center",
          )}
        >
          {typeof heading.text === "string" && heading.hlTexts
            ? highlightText(heading.text, heading.hlTexts)
            : heading.text}
        </h1>
      </HeadingWithIcon>
    ) : null;

  // Text
  const textElement = (
    <RichTextRenderer
      className={twMerge("text-dark/90", centered && "text-center")}
      richText={text.text}
    />
  );

  // Button
  const buttonElement =
    showButton && button && buttonUrl ? (
      <div className={twMerge("w-fit", centered && "mx-auto")}>
        <ButtonLink
          href={buttonUrl}
          variant={
            (button as { variant?: string })
              .variant as ButtonLinkProps["variant"]
          }
          target={(button as { newTab?: boolean }).newTab ? "_blank" : "_self"}
        >
          {(button as { text?: string }).text}
        </ButtonLink>
      </div>
    ) : null;

  return (
    <section
      id={id}
      className={twMerge(
        "w-full overflow-hidden",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-10 w-11/12 mx-auto",
          getMaxWidthClass(),
        )}
      >
        {(subheadingElement || headingElement) && (
          <header className="flex flex-col items-center gap-2">
            {subheadingElement}
            {headingElement}
          </header>
        )}
        {textElement}
        {buttonElement}
      </div>
    </section>
  );
};

export default Text;
