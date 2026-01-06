import React from "react";
import { twMerge } from "tailwind-merge";
import type { ScheduleBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getPaddingClasses } from "@/utils";

const Schedule: React.FC<ScheduleBlock & { id?: string; globals: Globals }> = ({
  iframeUrl,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  if (!iframeUrl) {
    return null;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "w-full",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Iframe */}
        <iframe className="w-full h-[70vh] rounded-lg" src={iframeUrl} />
      </div>
    </section>
  );
};

export default Schedule;
