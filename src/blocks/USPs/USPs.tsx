import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import type { USPsBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses } from "@/utils";

const USPs: React.FC<USPsBlock & { id?: string; globals: Globals }> = ({
  usps,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  if (!usps || usps.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "flex justify-center w-full py-10 text-gray",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "grid grid-cols-2 w-full max-w-7xl mx-auto",
          "de:flex de:justify-between de:grid-cols-4",
        )}
      >
        {/* Unique selling points */}
        {usps.map((usp, index) => {
          const { url: iconUrl, alt: iconAlt } = usp.icon
            ? getMediaUrlAndAlt(usp.icon)
            : { url: undefined, alt: undefined };

          return (
            <div
              key={index}
              className={twMerge(
                "relative flex flex-col items-center justify-center",
                "gap-2 w-full h-24 text-center",
              )}
            >
              {/* Vertical divider for mobile screens */}
              {index % 2 !== 0 && (
                <div
                  className={twMerge(
                    "absolute left-0 w-px h-full -translate-x-1/2",
                    "bg-gray/10",
                    "de:hidden",
                  )}
                />
              )}

              {/* Vertical divider for desktop screens */}
              {index !== 0 && (
                <div
                  className={twMerge(
                    "hidden absolute left-0 w-px h-full -translate-x-1/2",
                    "bg-gray/10",
                    "de:block",
                  )}
                />
              )}

              {/* Image container */}
              {iconUrl && (
                <figure className="relative w-8 h-8">
                  <Image
                    className="object-contain"
                    src={iconUrl}
                    alt={iconAlt || usp.text || ""}
                    fill={true}
                    priority={true}
                  />
                </figure>
              )}

              {/* Text */}
              {usp.text && (
                <p
                  className={twMerge(
                    "text-[11px] w-40 h-9 font-semibold uppercase",
                    "xs:text-[12px]",
                  )}
                >
                  {usp.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default USPs;
