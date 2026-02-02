import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
  BackgroundImage,
  BackgroundVideo,
  ButtonLink,
  HeadingWithIcon,
  type ButtonLinkProps,
} from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { CallToActionBlock } from "@/payload-types";
import type { Globals, RawUrl, RichText } from "@/types";
import {
  getMediaUrlAndAlt,
  getMimeType,
  getPaddingClasses,
  getUrl,
  processText,
} from "@/utils";

const CallToAction: React.FC<
  CallToActionBlock & { id?: string; globals: Globals }
> = ({
  visual,
  visualMobile,
  showHeading,
  heading,
  text,
  button,
  showButton2,
  button2,
  showSocialMedia,
  socialMedia,
  paddingTop,
  paddingBottom,
  hidden,
  id,
  globals,
}) => {
  const { url: visualUrl, alt: visualAlt } = visual
    ? getMediaUrlAndAlt(visual)
    : { url: "", alt: "" };
  const { url: visualMobileUrl, alt: visualMobileAlt } = visualMobile
    ? getMediaUrlAndAlt(visualMobile)
    : { url: "", alt: "" };
  const mimeType = getMimeType(visual);
  const mimeTypeMobile = getMimeType(visualMobile);
  const isVideo = mimeType?.startsWith("video/") ?? false;
  const isVideoMobile = mimeTypeMobile?.startsWith("video/") ?? false;
  const mobileUrl = visualMobileUrl || visualUrl;
  const mobileAlt = visualMobileUrl ? visualMobileAlt : visualAlt;
  const buttonUrl = getUrl(button as RawUrl, globals);
  const button2Url =
    showButton2 && button2 ? getUrl(button2 as RawUrl, globals) : undefined;

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
          "relative flex flex-col items-center gap-12 mx-auto",
          visualUrl &&
            "w-full max-w-500 text-white rounded-4xl overflow-hidden",
          !visualUrl && "w-5/6 max-w-5xl",
          "de:gap-8",
        )}
      >
        {/* Background video or image - mobile (visualMobile or visual) */}
        {mobileUrl && (
          <div className="de:hidden absolute inset-0">
            {isVideoMobile ? (
              <BackgroundVideo
                alt={mobileAlt}
                src={mobileUrl}
                type={mimeTypeMobile ?? "video/webm"}
              />
            ) : (
              <BackgroundImage alt={mobileAlt} src={mobileUrl} />
            )}
          </div>
        )}
        {/* Background video or image - desktop (visual only) */}
        {visualUrl && (
          <div className="hidden de:block absolute inset-0">
            {isVideo ? (
              <BackgroundVideo
                alt={visualAlt}
                src={visualUrl}
                type={mimeType ?? "video/webm"}
              />
            ) : (
              <BackgroundImage alt={visualAlt} src={visualUrl} />
            )}
          </div>
        )}
        {/* Dark overlay - stronger on the right */}
        {(visualUrl || mobileUrl) && (
          <div
            className="absolute inset-0 z-0 bg-linear-to-r from-transparent to-dark/80"
            aria-hidden="true"
          />
        )}
        {/* Content wrapper */}
        <div
          className={twMerge(
            "relative z-10 flex flex-col gap-8",
            visualUrl
              ? "max-w-200 min-h-90 xs:min-h-120 md:min-h-150 xl:min-h-180  justify-center items-end px-12 py-16 de:px-32 ml-auto"
              : "items-center",
          )}
        >
          {/* Heading */}
          {showHeading && heading && (
            <AnimatedWrapper delay={0} direction="up">
              <HeadingWithIcon icon={heading.icon}>
                <h2
                  className={twMerge(
                    "font-bold text-right",
                    visualUrl ? "text-right" : "text-center",
                  )}
                >
                  {typeof heading.text === "string"
                    ? processText(heading.text)
                    : heading.text}
                </h2>
              </HeadingWithIcon>
            </AnimatedWrapper>
          )}

          {/* Text */}
          <AnimatedWrapper delay={0.1} direction="up">
            <RichTextRenderer
              className={twMerge(
                "text-[16px]",
                visualUrl ? "text-right" : "text-center",
              )}
              richText={text as RichText}
            />
          </AnimatedWrapper>

          {/* Social media links and buttons */}
          {(showSocialMedia &&
            socialMedia?.links &&
            socialMedia.links.length > 0) ||
          (button && buttonUrl) ||
          (showButton2 && button2 && button2Url) ? (
            <AnimatedWrapper delay={0.2} direction="up">
              <div className="flex flex-wrap items-center justify-end gap-4 text-[15px] w-full">
                {/* Social media links */}
                {showSocialMedia &&
                  socialMedia?.links &&
                  socialMedia.links.length > 0 &&
                  socialMedia.links.map((link, index) => {
                    const { url: iconUrl, alt: iconAlt } = link.icon
                      ? getMediaUrlAndAlt(link.icon)
                      : { url: undefined, alt: undefined };

                    if (!iconUrl || !link.url) {
                      return null;
                    }

                    return (
                      <Link
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={twMerge(
                          "flex items-center justify-center w-14 h-14",
                          "text-white bg-transparent rounded-full border-2 border-white/30",
                          "backdrop-blur-sm transition-all duration-300",
                          "hover:scale-105 hover:border-white/60 hover:bg-white/5",
                          "overflow-hidden relative",
                        )}
                        aria-label={`Social media link ${index + 1}`}
                      >
                        <figure className="relative w-6 h-6 z-10">
                          <Image
                            className="object-contain"
                            src={iconUrl}
                            alt={iconAlt || `Social media link ${index + 1}`}
                            fill={true}
                          />
                        </figure>
                      </Link>
                    );
                  })}

                {/* Buttons */}
                {button && buttonUrl && (
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
      </div>
    </section>
  );
};

export default CallToAction;
