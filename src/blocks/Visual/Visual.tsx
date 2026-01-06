import React from "react";
import { twMerge } from "tailwind-merge";
import {
  BackgroundImage,
  BackgroundVideo,
  HeadingWithIcon,
} from "@/components";
import type { VisualBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getMediaUrlAndAlt, getMimeType, highlightText } from "@/utils";

const Visual: React.FC<VisualBlock & { id?: string; globals: Globals }> = ({
  visual,
  showHeading,
  heading,
  height,
  hidden,
  id,
}) => {
  const { url: visualUrl, alt: visualAlt } = visual
    ? getMediaUrlAndAlt(visual)
    : { url: "", alt: "" };
  const mimeType = getMimeType(visual);
  const isVideo = mimeType?.startsWith("video/") ?? false;

  const getHeightClasses = () => {
    switch (height) {
      case "small":
        return "h-90 de:h-120 xl:h-150";
      case "medium":
        return "h-120 de:h-150 xl:h-180";
      case "large":
        return "h-150 de:h-180 xl:h-210";
      default:
        return "h-120 de:h-150 xl:h-180";
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
      {visualUrl &&
        (isVideo ? (
          <BackgroundVideo
            alt={visualAlt}
            src={visualUrl}
            type={mimeType ?? "video/webm"}
          />
        ) : (
          <BackgroundImage alt={visualAlt} src={visualUrl} />
        ))}

      {/* Container */}
      {showHeading && heading && (
        <div
          className={twMerge(
            "z-10 flex flex-col items-center gap-8",
            "w-11/12 max-w-4xl mx-auto text-center text-white",
            "de:gap-4",
          )}
        >
          {/* Heading */}
          <HeadingWithIcon icon={heading.icon}>
            <h1 className="font-bold text-white">
              {typeof heading.text === "string" && heading.hlTexts
                ? highlightText(heading.text, heading.hlTexts)
                : heading.text}
            </h1>
          </HeadingWithIcon>
        </div>
      )}
    </section>
  );
};

export default Visual;
