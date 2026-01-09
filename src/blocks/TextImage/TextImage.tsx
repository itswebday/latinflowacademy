import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
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
  showButton2,
  button2,
  image,
  bgColor,
  bgElements,
  paddingTop,
  paddingBottom,
  hidden,
  id,
  globals,
}) => {
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;
  const button2Url =
    showButton2 && button2 ? getUrl(button2 as RawUrl, globals) : undefined;
  const { url: imageUrl, alt: imageAlt } = getMediaUrlAndAlt(
    image?.file as number | { id?: number; url?: string; alt?: string } | null,
  );

  const getImageHeightClass = () => {
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

  const getBoxHeightClass = () => {
    switch (image?.height) {
      case "small":
        return "h-[220%] de:h-140";
      case "medium":
        return "h-[220%] de:h-170";
      case "large":
        return "h-[220%] de:h-200";
      default:
        return "h-[220%] de:h-170";
    }
  };

  return (
    <section
      id={id}
      className={twMerge(
        "relative w-full overflow-hidden",
        getBackgroundClasses(bgColor),
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
          bgElements === "box" && "pt-16 de:py-25",
        )}
      >
        {/* Text wrapper */}
        <div
          className={twMerge(
            "relative z-10 flex flex-col gap-6 w-11/12 mx-auto",
            "de:grow de:w-full",
          )}
        >
          {/* Background box */}
          {bgElements === "box" && (
            <div
              className={twMerge(
                "z-0 absolute left-1/2 -top-16 de:top-1/2 -translate-x-1/2 de:-translate-y-1/2 w-screen de:w-[200%] rounded-4xl bg-primary/8 overflow-hidden",
                getBoxHeightClass(),
              )}
            >
              {/* Abstract background elements */}
              {/* CSS circles - maintain circular shape */}
              <div
                className="absolute -right-20 -bottom-30 de:-right-30 de:-bottom-100 rounded-full pointer-events-none w-[300px] h-[300px] de:w-[600px] de:h-[600px]"
                style={{
                  backgroundColor: "#160b14",
                  opacity: 0.4,
                }}
              />
              <div
                className="absolute -left-50 -top-50 de:-left-100 de:-top-150 rounded-full pointer-events-none w-[500px] h-[500px] de:w-[1000px] de:h-[1000px]"
                style={{
                  backgroundColor: "#160b14",
                  opacity: 0.4,
                }}
              />
              {/* Wave shape SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1200 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Wave shape */}
                <path
                  d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
                  fill="url(#gradient3)"
                  opacity="0.25"
                />
                {/* Gradients */}
                <defs>
                  <linearGradient
                    id="gradient3"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#160b14" />
                    <stop offset="50%" stopColor="#2a1a24" />
                    <stop offset="100%" stopColor="#160b14" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          {/* Heading */}
          {showHeading && heading ? (
            <AnimatedWrapper className="z-10" delay={0} direction="up">
              <HeadingWithIcon icon={heading.icon}>
                <h3 className="font-bold">
                  {typeof heading.text === "string" && heading.hlTexts
                    ? highlightText(heading.text, heading.hlTexts)
                    : heading.text}
                </h3>
              </HeadingWithIcon>
            </AnimatedWrapper>
          ) : null}

          {/* Text */}
          <AnimatedWrapper className="z-10" delay={0.1} direction="up">
            <RichTextRenderer richText={text.text} />
          </AnimatedWrapper>

          {/* Buttons */}
          {(showButton && button && buttonUrl) ||
          (showButton2 && button2 && button2Url) ? (
            <AnimatedWrapper className="z-10" delay={0.2} direction="up">
              <div className="flex flex-wrap items-start justify-start gap-4 text-[15px] w-full">
                {showButton && button && buttonUrl && (
                  <ButtonLink
                    variant={button.variant as ButtonLinkProps["variant"]}
                    href={buttonUrl}
                    target={button.newTab ? "_blank" : "_self"}
                  >
                    {button.text}
                  </ButtonLink>
                )}
                {showButton2 && button2 && button2Url && (
                  <ButtonLink
                    variant={
                      (button2 as { variant?: string })
                        .variant as ButtonLinkProps["variant"]
                    }
                    href={button2Url}
                    target={
                      (button2 as { newTab?: boolean }).newTab
                        ? "_blank"
                        : "_self"
                    }
                  >
                    {(button2 as { text?: string }).text}
                  </ButtonLink>
                )}
              </div>
            </AnimatedWrapper>
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
                "image-wrapper z-20 relative justify-center items-center",
                "w-full shrink-0 text-center",
                image.fit === "cover" && getImageHeightClass(),
              )}
            >
              {/* Image */}
              {imageUrl ? (
                <figure
                  className={twMerge(
                    "relative flex rounded-3xl overflow-hidden",
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
