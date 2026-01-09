import React from "react";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
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

  // Subheading
  const subheadingElement =
    showSubheading && subheading ? (
      <HeadingWithIcon icon={subheading.icon}>
        <h5 className="font-bold text-center">
          {typeof subheading.text === "string" && subheading.hlTexts
            ? highlightText(subheading.text, subheading.hlTexts)
            : subheading.text}
        </h5>
      </HeadingWithIcon>
    ) : null;

  // Heading
  const headingElement =
    showHeading && heading ? (
      <HeadingWithIcon icon={heading.icon}>
        <h2 className={twMerge("font-bold", centered && "text-center")}>
          {typeof heading.text === "string" && heading.hlTexts
            ? highlightText(heading.text, heading.hlTexts)
            : heading.text}
        </h2>
      </HeadingWithIcon>
    ) : null;

  // Button
  const buttonElement =
    showButton && button && buttonUrl ? (
      <ButtonLink
        href={buttonUrl}
        variant={
          (button as { variant?: string }).variant as ButtonLinkProps["variant"]
        }
        target={(button as { newTab?: boolean }).newTab ? "_blank" : "_self"}
      >
        {(button as { text?: string }).text}
      </ButtonLink>
    ) : null;

  return (
    <section
      id={id}
      className={twMerge(
        "relative flex items-center justify-center w-full overflow-hidden",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "relative flex flex-col items-center gap-12 mx-auto w-5/6 max-w-5xl",
          "de:gap-8",
        )}
      >
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col gap-8 items-center">
          {(subheadingElement || headingElement) && (
            <AnimatedWrapper delay={0} direction="up">
              <header className="flex flex-col items-center gap-2">
                {subheadingElement}
                {headingElement}
              </header>
            </AnimatedWrapper>
          )}
          <AnimatedWrapper delay={0.1} direction="up">
            <RichTextRenderer
              className="text-[16px] text-center"
              richText={text.text}
            />
          </AnimatedWrapper>
          {buttonElement && (
            <AnimatedWrapper delay={0.2} direction="up">
              {buttonElement}
            </AnimatedWrapper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Text;
