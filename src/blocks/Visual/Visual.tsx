import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
  BackgroundImage,
  BackgroundVideo,
  ButtonLink,
  type ButtonLinkProps,
  HeadingWithIcon,
} from "@/components";
import type { VisualBlock } from "@/payload-types";
import type { Globals, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getMimeType, getUrl, highlightText } from "@/utils";

const Visual: React.FC<VisualBlock & { id?: string; globals: Globals }> = ({
  visual,
  height,
  opacity,
  showHeading,
  heading,
  showButton,
  button,
  showSocialMedia,
  socialMedia,
  hidden,
  id,
  globals,
}) => {
  const { url: visualUrl, alt: visualAlt } = visual
    ? getMediaUrlAndAlt(visual)
    : { url: "", alt: "" };
  const mimeType = getMimeType(visual);
  const isVideo = mimeType?.startsWith("video/") ?? false;
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;
  const opacityValue = opacity !== undefined ? opacity / 100 : 1;

  const getHeightClasses = () => {
    switch (height) {
      case "small":
        return "h-90 xl:h-120";
      case "medium":
        return "h-120 xl:h-150";
      case "large":
        return "h-150 xl:h-180";
      default:
        return "h-120 xl:h-150";
    }
  };

  return (
    <section
      id={id}
      className={twMerge(
        "relative flex items-center justify-center w-full",
        getHeightClasses(),
        hidden && "hidden",
      )}
    >
      {/* Background video or image */}
      {visualUrl && (
        <div className="absolute inset-0" style={{ opacity: opacityValue }}>
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

      {/* Heading - centered */}
      {showHeading && heading && (
        <div className="z-10 absolute bottom-56 de:bottom-1/2 left-1/2 -translate-x-1/2 de:translate-y-1/2">
          <AnimatedWrapper delay={0} direction="up">
            <HeadingWithIcon icon={heading.icon}>
              <h1
                className={twMerge(
                  "font-bold text-center",
                  visualUrl ? "text-white" : "text-dark",
                )}
              >
                {typeof heading.text === "string" && heading.hlTexts
                  ? highlightText(heading.text, heading.hlTexts)
                  : heading.text}
              </h1>
            </HeadingWithIcon>
          </AnimatedWrapper>
        </div>
      )}

      {/* Button - bottom left */}
      {showButton && button && buttonUrl && (
        <div className="z-10 absolute bottom-8 left-8 de:bottom-16 de:left-16">
          <AnimatedWrapper delay={0.1} direction="up">
            <ButtonLink
              variant={button.variant as ButtonLinkProps["variant"]}
              href={buttonUrl}
              target={button.newTab ? "_blank" : "_self"}
            >
              {button.text}
            </ButtonLink>
          </AnimatedWrapper>
        </div>
      )}

      {/* Social media links - left above button on mobile, bottom right on desktop */}
      {showSocialMedia &&
        socialMedia?.links &&
        socialMedia.links.length > 0 && (
          <div className="z-10 absolute bottom-28 left-8 de:bottom-16 de:left-auto de:right-16">
            <AnimatedWrapper delay={0.1} direction="up">
              <div className="flex items-center justify-start gap-4 de:justify-end">
                {socialMedia.links.map((link, index) => {
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
              </div>
            </AnimatedWrapper>
          </div>
        )}
    </section>
  );
};

export default Visual;
