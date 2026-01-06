"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BackgroundImage, SwiperContainer } from "@/components";
import { DEFAULT_LOCALE } from "@/constants";
import type { LocaleOption } from "@/types";
import { request } from "@/utils";
import type { DanceStyleData } from "@/app/[locale]/dance-styles/_ui/DanceStyles/DanceStylesClient";

type DanceStylesClientProps = {
  swiper: boolean;
};

const DanceStylesClient: React.FC<DanceStylesClientProps> = ({ swiper }) => {
  const locale = useLocale() as LocaleOption;
  const [danceStyles, setDanceStyles] = useState<DanceStyleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    request<DanceStyleData[]>("GET", "/api/dance-styles-posts", locale, {
      defaultErrorMessage: "Failed to load dance styles",
      setData: (data) => setDanceStyles(data || []),
      setIsLoading,
    });
  }, [locale]);

  if (isLoading) {
    return null;
  }

  if (swiper) {
    return (
      <SwiperContainer spaceBetween={24}>
        {danceStyles.map((style) => (
          <DanceStyleCard key={style.id} danceStyle={style} locale={locale} />
        ))}
      </SwiperContainer>
    );
  }

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
      danceStyle.slug || ""
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
