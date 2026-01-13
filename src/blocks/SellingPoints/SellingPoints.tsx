import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper } from "@/components";
import type { SellingPointsBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses, processText } from "@/utils";

const SellingPoints: React.FC<
  SellingPointsBlock & { id?: string; globals: Globals }
> = ({ sellingPoints, paddingTop, paddingBottom, hidden, id }) => {
  if (!sellingPoints || sellingPoints.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "relative w-full overflow-hidden",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="relative z-10 w-5/6 mx-auto">
        {/* Grid */}
        <div className="flex flex-col gap-4 de:flex-row de:justify-center de:gap-6">
          {sellingPoints.map((point, index) => {
            const { url: iconUrl, alt: iconAlt } = point.icon
              ? getMediaUrlAndAlt(point.icon)
              : { url: undefined, alt: "" };

            return (
              <AnimatedWrapper key={index} delay={index * 0.1} direction="up">
                <div
                  className={twMerge(
                    "relative flex flex-row de:flex-col items-center de:items-center gap-6 px-10 py-8 rounded-3xl",
                    "w-full de:w-[240px] overflow-hidden",
                    "bg-linear-to-br from-dark via-dark/90 to-dark/80",
                    "border border-primary/40",
                    "shadow-xl shadow-primary/20",
                  )}
                >
                  {/* Gradient overlay */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-3xl opacity-100",
                      "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
                    )}
                  />

                  {/* Icon */}
                  {iconUrl && (
                    <div className="relative z-10 shrink-0">
                      <figure className="relative w-9 h-9">
                        <Image
                          className="object-contain"
                          src={iconUrl}
                          alt={iconAlt || point.text || ""}
                          fill={true}
                        />
                      </figure>
                    </div>
                  )}

                  {/* Text */}
                  {point.text && (
                    <span
                      className={twMerge(
                        "relative z-10 font-semibold text-white",
                        "de:text-center",
                      )}
                    >
                      {processText(point.text)}
                    </span>
                  )}

                  {/* Decorative corner accent */}
                  <div
                    className={twMerge(
                      "absolute top-0 right-0 w-16 h-16",
                      "bg-linear-to-br from-primary/20 to-transparent",
                      "rounded-bl-full opacity-100",
                    )}
                  />
                </div>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>

      {/* Wavy line */}
      <svg
        className="z-0 absolute bottom-0 left-0 right-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,80 Q300,50 600,80 Q900,110 1200,80"
          fill="none"
          stroke="#ec4899"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </section>
  );
};

export default SellingPoints;
