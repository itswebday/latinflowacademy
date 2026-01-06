"use client";

import { twMerge } from "tailwind-merge";
import type { LocaleOption } from "@/types";
import type { DanceStyleData } from "@/app/[locale]/dance-styles/_ui/DanceStyles/DanceStylesClient";
import DanceStylesClient from "@/app/[locale]/dance-styles/_ui/DanceStyles/DanceStylesClient";

type OtherDanceStylesProps = {
  danceStyles: DanceStyleData[];
  locale: LocaleOption;
  headingText: string;
};

const OtherDanceStyles: React.FC<OtherDanceStylesProps> = ({
  danceStyles,
  locale,
  headingText,
}) => {
  if (danceStyles.length === 0) {
    return null;
  }

  return (
    <section
      className={twMerge(
        "relative flex flex-col items-center gap-8 py-20 overflow-hidden",
      )}
    >
      {/* Header */}
      <header className={twMerge("w-5/6 max-w-7xl text-center")}>
        {/* Title */}
        <h2>{headingText}</h2>
      </header>

      {/* Dance styles */}
      <div className={twMerge("w-5/6 max-w-7xl")}>
        <DanceStylesClient danceStyles={danceStyles} locale={locale} />
      </div>
    </section>
  );
};

export default OtherDanceStyles;
