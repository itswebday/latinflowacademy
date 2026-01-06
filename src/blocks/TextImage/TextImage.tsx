import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import {
  ButtonLink,
  type ButtonLinkProps,
  HeadingWithIcon,
} from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { TextImageBlock } from "@/payload-types";
import type { Globals, RawUrl } from "@/types";
import {
  getBackgroundClasses,
  getMediaUrlAndAlt,
  getPaddingClasses,
  getUrl,
  highlightText,
} from "@/utils";

const TextImage: React.FC<
  TextImageBlock & { id?: string; globals: Globals }
> = ({
  showHeading,
  heading,
  text,
  showButton,
  button,
  image,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
  globals,
}) => {
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;
  const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(
    image?.file as number | { id?: number; url?: string; alt?: string } | null,
  );

  const getHeightClass = () => {
    switch (image?.height) {
      case "small":
        return "h-60 de:h-90";
      case "medium":
        return "h-80 de:h-120";
      case "large":
        return "h-100 de:h-150";
      default:
        return "h-80 de:h-120";
    }
  };

  return (
    <section
      id={id}
      className={twMerge(
        getBackgroundClasses(background),
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div
        id={`${id}-container`}
        className={twMerge(
          "flex justify-center items-center gap-12 w-11/12 max-w-150 mx-auto",
          "de:flex-row de:max-w-7xl",
          image?.posMo === "top" ? "flex-col-reverse" : "flex-col",
          image?.posDe === "left" ? "de:flex-row-reverse" : "de:flex-row",
        )}
      >
        {/* Text wrapper */}
        <div
          className={twMerge(
            "flex flex-col gap-6 w-11/12 mx-auto",
            "de:grow de:w-full",
          )}
        >
          {/* Heading */}
          {showHeading && heading ? (
            <HeadingWithIcon icon={heading.icon}>
              <h3 className="font-bold">
                {typeof heading.text === "string" && heading.hlTexts
                  ? highlightText(heading.text, heading.hlTexts)
                  : heading.text}
              </h3>
            </HeadingWithIcon>
          ) : null}

          {/* Text */}
          <RichTextRenderer richText={text.text} />

          {/* Button */}
          {showButton && button && buttonUrl ? (
            <ButtonLink
              variant={button.variant as ButtonLinkProps["variant"]}
              href={buttonUrl}
              target={button.newTab ? "_blank" : "_self"}
            >
              {button.text}
            </ButtonLink>
          ) : null}
        </div>

        {/* Image wrapper */}
        {imageUrl && (
          <>
            {/* Width */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @media (min-width: 900px) {
                    #${id}-container .image-wrapper {
                      width: ${image.width}% !important;
                    }
                  }
                `,
              }}
            />

            {/* Wrapper */}
            <div
              className={twMerge(
                "image-wrapper relative justify-center items-center shrink-0",
                "w-full text-center",
                image.fit === "cover" && getHeightClass(),
              )}
            >
              {/* Image */}
              {imageUrl ? (
                <figure
                  className={twMerge(
                    "relative flex rounded-lg overflow-hidden",
                    "de:w-full de:max-h-full",
                    image.fit === "contain" && "inline-block max-h-90 w-auto",
                    image.fit === "cover" && "w-full h-full",
                  )}
                >
                  {image.fit === "cover" ? (
                    <Image
                      className="object-cover"
                      src={imageUrl}
                      alt={imageAlt}
                      fill={true}
                      sizes="100vw"
                      loading="eager"
                    />
                  ) : (
                    <Image
                      className={twMerge(
                        "object-contain h-auto max-h-90 w-auto",
                        "de:w-full de:max-h-full",
                      )}
                      src={imageUrl}
                      alt={imageAlt}
                      width={1920}
                      height={1080}
                      sizes="100vw"
                      loading="eager"
                    />
                  )}
                </figure>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TextImage;
