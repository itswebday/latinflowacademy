import React from "react";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import type { HeadingBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getPaddingClasses, highlightText } from "@/utils";

const Heading: React.FC<HeadingBlock & { id?: string; globals: Globals }> = ({
  tagName,
  text,
  hlTexts,
  centered,
  background,
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
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 mx-auto">
        {/* Heading */}
        {text && (
          <HeadingWithIcon
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
        )}
      </div>
    </section>
  );
};

export default Heading;
