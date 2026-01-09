import React from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import type { HeadingBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getPaddingClasses, highlightText } from "@/utils";

const Heading: React.FC<HeadingBlock & { id?: string; globals: Globals }> = ({
  icon,
  text,
  hlTexts,
  tagName,
  centered,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
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
      <div className="w-11/12 mx-auto">
        {/* Heading */}
        {text && (
          <AnimatedWrapper delay={0} direction="up">
            <HeadingWithIcon
              icon={icon}
              className={centered ? "justify-center text-center" : undefined}
            >
              {React.createElement(
                tagName,
                {
                  className: twMerge(
                    "font-bold text-dark",
                    centered && "justify-center text-center",
                  ),
                },
                typeof text === "string" && hlTexts
                  ? highlightText(text, hlTexts)
                  : text,
              )}
            </HeadingWithIcon>
          </AnimatedWrapper>
        )}
      </div>
    </section>
  );
};

export default Heading;
