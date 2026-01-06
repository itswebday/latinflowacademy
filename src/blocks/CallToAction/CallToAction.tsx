import React from "react";
import { twMerge } from "tailwind-merge";
import {
  BackgroundImage,
  ButtonLink,
  HeadingWithIcon,
  type ButtonLinkProps,
} from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { CallToActionBlock } from "@/payload-types";
import type { Globals, RawUrl, RichText } from "@/types";
import {
  getMediaUrlAndAlt,
  getPaddingClasses,
  getUrl,
  highlightText,
} from "@/utils";

const CallToAction: React.FC<
  CallToActionBlock & { id?: string; globals: Globals }
> = ({
  image,
  showHeading,
  heading,
  text,
  button,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
  globals,
}) => {
  const { url: imageUrl, alt: imageAlt } = image
    ? getMediaUrlAndAlt(image)
    : { url: "", alt: "" };
  const buttonUrl = getUrl(button as RawUrl, globals);

  return (
    <section
      id={id}
      className={twMerge(
        "relative flex items-center justify-center w-full",
        imageUrl && "min-h-[500px] de:min-h-[600px]",
        !imageUrl && background === "white" && "bg-white",
        !imageUrl && background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Background image */}
      {imageUrl && (
        <figure className="absolute w-full h-full">
          <BackgroundImage
            className="bg-top object-cover"
            src={imageUrl}
            alt={imageAlt || heading?.text || "Call to action"}
          />
        </figure>
      )}

      {/* Container */}
      <div
        className={twMerge(
          "z-10 flex flex-col items-center gap-12",
          "w-11/12 max-w-7xl mx-auto text-center",
          imageUrl && "text-white",
          "de:gap-8",
        )}
      >
        {/* Heading */}
        {showHeading && heading && (
          <HeadingWithIcon icon={heading.icon}>
            <h2 className="font-bold text-white">
              {typeof heading.text === "string" && heading.hlTexts
                ? highlightText(heading.text, heading.hlTexts)
                : heading.text}
            </h2>
          </HeadingWithIcon>
        )}

        {/* Text */}
        <RichTextRenderer
          className="text-[18px] text-white"
          richText={text as RichText}
        />

        {/* Button */}
        {button && buttonUrl && (
          <div className="text-[15px] mt-4">
            <ButtonLink
              variant={button.variant as ButtonLinkProps["variant"]}
              href={buttonUrl}
              target={button.newTab ? "_blank" : "_self"}
            >
              {button.text}
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default CallToAction;
