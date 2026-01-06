import React from "react";
import { twMerge } from "tailwind-merge";
import type { DanceStylesBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getBackgroundClasses, getPaddingClasses } from "@/utils";
import DanceStylesClient from "./DanceStylesClient";

const DanceStyles: React.FC<
  DanceStylesBlock & { id?: string; globals: Globals }
> = ({ swiper, background, paddingTop, paddingBottom, hidden, id }) => {
  return (
    <section
      id={id}
      className={twMerge(
        "relative flex flex-col items-center gap-8 w-full overflow-hidden",
        getBackgroundClasses(background),
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl">
        <DanceStylesClient swiper={swiper || false} />
      </div>
    </section>
  );
};

export default DanceStyles;
