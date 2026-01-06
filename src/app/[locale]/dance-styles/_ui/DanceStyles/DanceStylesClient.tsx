"use client";

import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BackgroundImage } from "@/components";
import { DEFAULT_LOCALE } from "@/constants";
import type { LocaleOption } from "@/types";

export type DanceStyleData = {
  id: number;
  slug: string;
  url: string;
  squareImageURL: string;
  squareImageAlt: string;
  name: string;
  title?: string | null;
};

type DanceStylesClientProps = {
  danceStyles: DanceStyleData[];
  locale: LocaleOption;
};

const DanceStylesClient: React.FC<DanceStylesClientProps> = ({
  danceStyles,
  locale,
}) => {
  return (
    <div
      className={twMerge(
        "grid justify-center gap-6",
        "grid-cols-[repeat(auto-fit,var(--width-dance-style))]",
        "de:gap-12",
      )}
    >
      {danceStyles.map((style) => (
        <DanceStyleCard key={style.id} danceStyle={style} locale={locale} />
      ))}
    </div>
  );
};

type DanceStyleCardProps = {
  danceStyle: DanceStyleData;
  locale: LocaleOption;
};

const DanceStyleCard: React.FC<DanceStyleCardProps> = ({
  danceStyle,
  locale,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const href =
    danceStyle.url ||
    `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/dance-styles/${
      danceStyle.slug
    }`;

  return (
    <Link
      className={twMerge(
        "relative flex flex-col items-center gap-6",
        "w-dance-style h-dance-style p-4",
        "border border-gray/30 rounded-sm",
      )}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {danceStyle.squareImageURL && (
        <figure className="relative w-full h-72 overflow-hidden">
          <BackgroundImage
            className={twMerge(
              "transition-transform duration-500 ease-in-out",
              isHovered && "scale-[1.15]",
            )}
            src={danceStyle.squareImageURL}
            alt={danceStyle.squareImageAlt}
          />
        </figure>
      )}

      {/* Description */}
      <div className="flex flex-col gap-2 pb-2 text-center">
        {/* Name */}
        <h5 className="font-semibold">{danceStyle.name}</h5>

        {/* Title */}
        {danceStyle.title && <p>{danceStyle.title}</p>}
      </div>
    </Link>
  );
};

export default DanceStylesClient;
