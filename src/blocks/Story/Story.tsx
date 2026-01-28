import React from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { StoryBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses, processText } from "@/utils";
import StoryClient from "./StoryClient";

const Story: React.FC<StoryBlock & { id?: string; globals: Globals }> = ({
  heading,
  main,
  a,
  b,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  if (!main) {
    return null;
  }

  // Pre-render content server-side
  const { url: mainImageUrl, alt: mainImageAlt } = main.image
    ? getMediaUrlAndAlt(main.image)
    : { url: undefined, alt: undefined };

  const mainGroup = {
    name: main.name,
    title:
      typeof main.title === "string" ? processText(main.title) : main.title,
    text: <RichTextRenderer richText={main.text as RichText} />,
    imageUrl: mainImageUrl,
    imageAlt: mainImageAlt,
  };

  const aGroup = a
    ? (() => {
        const { url: aImageUrl, alt: aImageAlt } = a.image
          ? getMediaUrlAndAlt(a.image)
          : { url: undefined, alt: undefined };
        return {
          firstName: a.firstName,
          lastName: a.lastName,
          title: typeof a.title === "string" ? processText(a.title) : a.title,
          text: <RichTextRenderer richText={a.text as RichText} />,
          imageUrl: aImageUrl,
          imageAlt: aImageAlt,
        };
      })()
    : null;

  const bGroup = b
    ? (() => {
        const { url: bImageUrl, alt: bImageAlt } = b.image
          ? getMediaUrlAndAlt(b.image)
          : { url: undefined, alt: undefined };
        return {
          firstName: b.firstName,
          lastName: b.lastName,
          title: typeof b.title === "string" ? processText(b.title) : b.title,
          text: <RichTextRenderer richText={b.text as RichText} />,
          imageUrl: bImageUrl,
          imageAlt: bImageAlt,
        };
      })()
    : null;

  return (
    <section
      id={id}
      className={twMerge(
        "w-full overflow-hidden",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="relative w-full py-20">
        {/* Abstract background elements */}
        <div
          className={twMerge(
            "absolute inset-0 z-0 pointer-events-none",
            "overflow-hidden",
          )}
          aria-hidden="true"
        >
          {/* Large circular elements */}
          <div
            className="absolute -right-20 -bottom-30 de:-right-30 de:-bottom-100 rounded-full pointer-events-none w-[300px] h-[300px] de:w-[600px] de:h-[600px]"
            style={{
              backgroundColor: "#160b14",
              opacity: 0.6,
            }}
          />
          <div
            className="absolute -left-50 -top-50 de:-left-100 de:-top-150 rounded-full pointer-events-none w-[500px] h-[500px] de:w-[1000px] de:h-[1000px]"
            style={{
              backgroundColor: "#160b14",
              opacity: 0.6,
            }}
          />
          {/* Gradient overlay */}
          <div
            className={twMerge(
              "absolute inset-0",
              "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
            )}
          />
          {/* Wave shape SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
              fill="url(#storyGradient)"
              opacity="0.4"
            />
            <defs>
              <linearGradient
                id="storyGradient"
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
        {/* Header */}
        {heading && (
          <AnimatedWrapper
            className="w-11/12 max-w-5xl mx-auto"
            delay={0}
            direction="up"
          >
            <header className="relative z-10 mb-10">
              <HeadingWithIcon
                className="justify-center text-center"
                icon={heading.icon}
              >
                <h1
                  className={twMerge(
                    "font-bold justify-center text-center",
                    "bg-linear-to-r from-primary via-secondary to-primary",
                    "bg-clip-text text-transparent",
                    "bg-size-[200%_auto]",
                    "animate-[gradient_3s_ease_infinite]",
                    "drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]",
                    "drop-shadow-[0_0_40px_rgba(162,54,219,0.2)]",
                  )}
                >
                  {typeof heading.text === "string"
                    ? processText(heading.text)
                    : heading.text}
                </h1>
              </HeadingWithIcon>
            </header>
          </AnimatedWrapper>
        )}

        {/* Client component for interactive content */}
        <div className="relative z-10 w-5/6 max-w-5xl mx-auto">
          <StoryClient main={mainGroup} a={aGroup} b={bGroup} />
        </div>
      </div>
    </section>
  );
};

export default Story;
