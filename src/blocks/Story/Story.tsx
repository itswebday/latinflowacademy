"use client";

import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { StoryBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getMediaUrlAndAlt, processText } from "@/utils";

const Story: React.FC<StoryBlock & { id?: string; globals: Globals }> = ({
  heading,
  main,
  a,
  b,
  hidden,
  id,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<"a" | "b" | null>(null);

  // Get the active content group
  const activeGroup =
    selectedGroup === "a" ? a : selectedGroup === "b" ? b : main;

  if (!activeGroup) {
    return null;
  }

  const { url: imageUrl, alt: imageAlt } = activeGroup.image
    ? getMediaUrlAndAlt(activeGroup.image)
    : { url: undefined, alt: undefined };

  return (
    <section
      id={id}
      className={twMerge("w-full overflow-hidden", hidden && "hidden")}
    >
      {/* Container */}
      <div className="w-11/12 mx-auto">
        {/* Header */}
        {heading && (
          <AnimatedWrapper delay={0} direction="up">
            <header className="mb-12">
              <HeadingWithIcon
                className="justify-center text-center"
                icon={heading.icon}
              >
                <h1 className="font-bold text-dark justify-center text-center">
                  {typeof heading.text === "string"
                    ? processText(heading.text)
                    : heading.text}
                </h1>
              </HeadingWithIcon>
            </header>
          </AnimatedWrapper>
        )}

        {/* Toggle Buttons */}
        {a && b && (
          <AnimatedWrapper delay={0.1} direction="up">
            <div className="flex items-center justify-center gap-4 mb-12">
              <button
                type="button"
                onClick={() =>
                  setSelectedGroup(selectedGroup === "a" ? null : "a")
                }
                className={twMerge(
                  "px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200",
                  selectedGroup === "a"
                    ? "bg-primary text-white"
                    : "bg-light text-dark hover:bg-dark/5",
                )}
              >
                {a.name || "A"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedGroup(selectedGroup === "b" ? null : "b")
                }
                className={twMerge(
                  "px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200",
                  selectedGroup === "b"
                    ? "bg-primary text-white"
                    : "bg-light text-dark hover:bg-dark/5",
                )}
              >
                {b.name || "B"}
              </button>
            </div>
          </AnimatedWrapper>
        )}

        {/* Content with Image on Left, Text on Right */}
        <AnimatedWrapper delay={0.2} direction="up">
          <div
            className={twMerge(
              "flex flex-col items-center gap-8",
              "de:flex-row de:items-start",
            )}
          >
            {/* Image */}
            {imageUrl && (
              <figure
                className={twMerge(
                  "relative shrink-0 w-full aspect-video rounded-lg overflow-hidden",
                  "de:w-1/2",
                )}
              >
                <Image
                  className="object-cover"
                  src={imageUrl}
                  alt={imageAlt || activeGroup.name || ""}
                  fill={true}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </figure>
            )}

            {/* Content */}
            <div className={twMerge("flex flex-col gap-6 w-full", "de:w-1/2")}>
              {/* Name */}
              {activeGroup.name && (
                <p className="text-sm font-semibold text-dark/70 uppercase tracking-wide">
                  {activeGroup.name}
                </p>
              )}

              {/* Title */}
              {activeGroup.title && (
                <h2 className="text-2xl font-bold text-dark">
                  {typeof activeGroup.title === "string"
                    ? processText(activeGroup.title)
                    : activeGroup.title}
                </h2>
              )}

              {/* Text */}
              {activeGroup.text && (
                <RichTextRenderer richText={activeGroup.text as RichText} />
              )}
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default Story;
