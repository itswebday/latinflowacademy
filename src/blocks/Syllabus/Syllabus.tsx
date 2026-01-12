import React from "react";
import { twMerge } from "tailwind-merge";
import { getTranslations } from "next-intl/server";
import { AnimatedWrapper } from "@/components";
import type { SyllabusBlock } from "@/payload-types";
import { getPaddingClasses } from "@/utils";

const Syllabus: React.FC<SyllabusBlock & { id?: string }> = async ({
  levels,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  const syllabusT = await getTranslations("syllabus");
  if (!levels || levels.length === 0) {
    return null;
  }

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
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 de:grid-cols-2 xl:grid-cols-3 gap-8 de:gap-16 items-stretch">
          {levels.map((level, index) => {
            const patternVariation = index % 4;

            const backgroundPatterns = [
              "bg-[radial-gradient(circle_at_30%_20%,primary_0%,transparent_50%)]",
              "bg-[radial-gradient(circle_at_70%_80%,secondary_0%,transparent_50%)]",
              "bg-[radial-gradient(ellipse_at_top_left,primary_0%,transparent_60%)]",
              "bg-[radial-gradient(ellipse_at_bottom_right,secondary_0%,transparent_60%)]",
            ];

            const gradientOverlays = [
              "bg-linear-to-br from-primary/5 via-transparent to-secondary/5",
              "bg-linear-to-tl from-secondary/5 via-transparent to-primary/5",
              "bg-linear-to-r from-primary/5 via-secondary/5 to-transparent",
              "bg-linear-to-l from-transparent via-primary/5 to-secondary/5",
            ];

            return (
              <AnimatedWrapper
                key={index}
                delay={index * 0.1}
                direction="up"
                className="h-full relative"
              >
                <div
                  className={twMerge(
                    "relative flex flex-col items-start rounded-4xl",
                    "bg-linear-to-br from-dark via-dark/95 to-dark/90",
                    "border-2 border-primary/30",
                    "shadow-lg shadow-primary/10",
                    "h-full overflow-visible",
                  )}
                >
                  {/* Label positioned on top-left corner */}
                  {level.label && (
                    <AnimatedWrapper
                      delay={index * 0.1 + 0.1}
                      direction="down"
                      className="absolute -top-3 -left-3 z-20"
                    >
                      <div
                        className={twMerge(
                          "relative px-5 py-2 rounded-lg",
                          "bg-linear-to-br from-primary to-secondary",
                          "border-2 border-dark",
                          "text-white font-bold text-[12px] uppercase tracking-wider",
                          "shadow-xl shadow-primary/40",
                        )}
                      >
                        <span className="relative z-10">{level.label}</span>
                        {/* Corner notch effect */}
                        <div
                          className={twMerge(
                            "absolute -bottom-1 -right-1 w-3 h-3",
                            "bg-dark rotate-45",
                            "border-r border-b border-primary/20",
                          )}
                        />
                      </div>
                    </AnimatedWrapper>
                  )}

                  {/* Gradient overlay - varies by level */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-4xl opacity-100",
                      gradientOverlays[patternVariation],
                    )}
                  />

                  {/* Background pattern - varies by level */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-4xl opacity-10",
                      backgroundPatterns[patternVariation],
                    )}
                  />

                  {/* Content wrapper */}
                  <div className="flex flex-col items-start gap-8 px-8 pt-14 pb-10 w-full flex-1">
                    {/* Title */}
                    {level.title && (
                      <AnimatedWrapper
                        delay={index * 0.1 + 0.2}
                        direction="right"
                        className="relative z-10 w-full"
                      >
                        <h3
                          className={twMerge(
                            "text-[24px] font-bold text-white leading-tight",
                          )}
                        >
                          {level.title}
                        </h3>
                      </AnimatedWrapper>
                    )}

                    {/* Subtitle */}
                    <AnimatedWrapper
                      delay={index * 0.1 + 0.3}
                      direction="right"
                      className="relative z-10 w-full"
                    >
                      <p className={twMerge("text-white/60 leading-relaxed")}>
                        {level.subtitle}
                      </p>
                    </AnimatedWrapper>

                    {/* List */}
                    {level.list && level.list.length > 0 && (
                      <ul
                        className={twMerge(
                          "relative z-10 flex flex-col gap-5 w-full",
                          "list-none",
                        )}
                      >
                        {level.list.map((item, itemIndex) => {
                          if (!item.text) {
                            return null;
                          }

                          return (
                            <AnimatedWrapper
                              key={itemIndex}
                              delay={index * 0.1 + 0.4 + itemIndex * 0.05}
                              direction="right"
                              className="w-full"
                            >
                              <li
                                className={twMerge(
                                  "flex items-center gap-4",
                                  "text-white/90 leading-relaxed",
                                )}
                              >
                                {/* Bullet point */}
                                <div
                                  className={twMerge(
                                    "shrink-0 w-3 h-3 rounded-full",
                                    "bg-primary",
                                  )}
                                />
                                <span>{item.text}</span>
                              </li>
                            </AnimatedWrapper>
                          );
                        })}
                      </ul>
                    )}

                    {/* Goal - pushed to bottom */}
                    <AnimatedWrapper
                      delay={
                        index * 0.1 + 0.5 + (level.list?.length || 0) * 0.05
                      }
                      direction="up"
                      className="relative z-10 w-full mt-auto"
                    >
                      <div
                        className={twMerge(
                          "relative w-full pt-8",
                          "border-t-2 border-primary/20",
                        )}
                      >
                        <div
                          className={twMerge(
                            "absolute left-0 top-0 w-8 h-0.5",
                            "bg-linear-to-r from-primary to-secondary",
                            "opacity-0",
                          )}
                        />
                        <p
                          className={twMerge(
                            "text-white/80 text-[16px] leading-relaxed italic",
                          )}
                        >
                          <span className="font-bold text-primary">
                            {syllabusT("goal")}
                          </span>
                          {level.goal}
                        </p>
                      </div>
                    </AnimatedWrapper>
                  </div>

                  {/* Decorative accents - varies by level */}
                  {patternVariation === 0 && (
                    <>
                      {/* Bottom right */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 right-0 w-48 h-48",
                          "bg-linear-to-tr from-primary/10 to-transparent",
                          "rounded-tl-full",
                        )}
                      />
                      {/* Top right */}
                      <div
                        className={twMerge(
                          "absolute top-0 right-0 w-32 h-32",
                          "bg-linear-to-bl from-secondary/10 to-transparent",
                          "rounded-bl-full",
                        )}
                      />
                    </>
                  )}

                  {patternVariation === 1 && (
                    <>
                      {/* Top left */}
                      <div
                        className={twMerge(
                          "absolute top-0 left-0 w-56 h-56",
                          "bg-linear-to-br from-secondary/10 to-transparent",
                          "rounded-br-full",
                        )}
                      />
                      {/* Bottom left */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-0 w-40 h-40",
                          "bg-linear-to-tr from-primary/10 to-transparent",
                          "rounded-tr-full",
                        )}
                      />
                    </>
                  )}

                  {patternVariation === 2 && (
                    <>
                      {/* Top center */}
                      <div
                        className={twMerge(
                          "absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40",
                          "bg-linear-to-b from-primary/10 via-secondary/5 to-transparent",
                          "rounded-b-full",
                        )}
                      />
                      {/* Bottom corners */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-0 w-36 h-36",
                          "bg-linear-to-tr from-primary/8 to-transparent",
                          "rounded-tr-full",
                        )}
                      />
                      <div
                        className={twMerge(
                          "absolute bottom-0 right-0 w-36 h-36",
                          "bg-linear-to-tl from-secondary/8 to-transparent",
                          "rounded-tl-full",
                        )}
                      />
                    </>
                  )}

                  {patternVariation === 3 && (
                    <>
                      {/* Left side */}
                      <div
                        className={twMerge(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-40 h-80",
                          "bg-linear-to-r from-secondary/10 via-primary/5 to-transparent",
                          "rounded-r-full",
                        )}
                      />
                      {/* Right side */}
                      <div
                        className={twMerge(
                          "absolute right-0 top-1/4 w-32 h-64",
                          "bg-linear-to-l from-primary/10 to-transparent",
                          "rounded-l-full",
                        )}
                      />
                      {/* Bottom center */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32",
                          "bg-linear-to-t from-secondary/8 to-transparent",
                          "rounded-t-full",
                        )}
                      />
                    </>
                  )}
                </div>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Syllabus;
