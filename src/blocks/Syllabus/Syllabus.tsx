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
        {/* Grid - flex so fewer items center */}
        <div className="flex flex-wrap justify-center gap-8 de:gap-16">
          {levels.map((level, index) => {
            const patternVariation = index % 4;
            const color =
              (level.style?.color as
                | "primary"
                | "blue"
                | "green"
                | "red"
                | "orange"
                | "yellow") || "primary";

            const getBorderColor = () => {
              const colorMap = {
                primary: "border-primary/30",
                blue: "border-blue/30",
                green: "border-green/30",
                red: "border-red/30",
                orange: "border-orange/30",
                yellow: "border-yellow/30",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getShadowColor = () => {
              const colorMap = {
                primary: "shadow-primary/10",
                blue: "shadow-blue/10",
                green: "shadow-green/10",
                red: "shadow-red/10",
                orange: "shadow-orange/10",
                yellow: "shadow-yellow/10",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getLabelGradient = () => {
              if (color === "primary") {
                return "bg-linear-to-br from-primary to-secondary";
              }
              const colorMap: Record<
                "blue" | "green" | "red" | "orange" | "yellow",
                string
              > = {
                blue: "bg-linear-to-br from-blue to-blue/80",
                green: "bg-linear-to-br from-green to-green/80",
                red: "bg-linear-to-br from-red to-red/80",
                orange: "bg-linear-to-br from-orange to-orange/80",
                yellow: "bg-linear-to-br from-yellow to-yellow/80",
              };
              return (
                colorMap[color] || "bg-linear-to-br from-primary to-secondary"
              );
            };

            const getLabelShadow = () => {
              const colorMap = {
                primary: "shadow-primary/40",
                blue: "shadow-blue/40",
                green: "shadow-green/40",
                red: "shadow-red/40",
                orange: "shadow-orange/40",
                yellow: "shadow-yellow/40",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getLabelBorder = () => {
              const colorMap = {
                primary: "border-primary/20",
                blue: "border-blue/20",
                green: "border-green/20",
                red: "border-red/20",
                orange: "border-orange/20",
                yellow: "border-yellow/20",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getGradientOverlay = () => {
              const colorMap = {
                primary: [
                  "bg-linear-to-br from-primary/5 via-transparent to-secondary/5",
                  "bg-linear-to-tl from-secondary/5 via-transparent to-primary/5",
                  "bg-linear-to-r from-primary/5 via-secondary/5 to-transparent",
                  "bg-linear-to-l from-transparent via-primary/5 to-secondary/5",
                ],
                blue: [
                  "bg-linear-to-br from-blue/5 via-transparent to-blue/3",
                  "bg-linear-to-tl from-blue/3 via-transparent to-blue/5",
                  "bg-linear-to-r from-blue/5 via-blue/3 to-transparent",
                  "bg-linear-to-l from-transparent via-blue/5 to-blue/3",
                ],
                green: [
                  "bg-linear-to-br from-green/5 via-transparent to-green/3",
                  "bg-linear-to-tl from-green/3 via-transparent to-green/5",
                  "bg-linear-to-r from-green/5 via-green/3 to-transparent",
                  "bg-linear-to-l from-transparent via-green/5 to-green/3",
                ],
                red: [
                  "bg-linear-to-br from-red/5 via-transparent to-red/3",
                  "bg-linear-to-tl from-red/3 via-transparent to-red/5",
                  "bg-linear-to-r from-red/5 via-red/3 to-transparent",
                  "bg-linear-to-l from-transparent via-red/5 to-red/3",
                ],
                orange: [
                  "bg-linear-to-br from-orange/5 via-transparent to-orange/3",
                  "bg-linear-to-tl from-orange/3 via-transparent to-orange/5",
                  "bg-linear-to-r from-orange/5 via-orange/3 to-transparent",
                  "bg-linear-to-l from-transparent via-orange/5 to-orange/3",
                ],
                yellow: [
                  "bg-linear-to-br from-yellow/5 via-transparent to-yellow/3",
                  "bg-linear-to-tl from-yellow/3 via-transparent to-yellow/5",
                  "bg-linear-to-r from-yellow/5 via-yellow/3 to-transparent",
                  "bg-linear-to-l from-transparent via-yellow/5 to-yellow/3",
                ],
              };
              return (
                colorMap[color]?.[patternVariation] ||
                colorMap.primary[patternVariation]
              );
            };

            const getBackgroundPattern = () => {
              const colorValue = color === "primary" ? "primary" : color;
              const patterns = [
                `bg-[radial-gradient(circle_at_30%_20%,${colorValue}_0%,transparent_50%)]`,
                `bg-[radial-gradient(circle_at_70%_80%,${colorValue}_0%,transparent_50%)]`,
                `bg-[radial-gradient(ellipse_at_top_left,${colorValue}_0%,transparent_60%)]`,
                `bg-[radial-gradient(ellipse_at_bottom_right,${colorValue}_0%,transparent_60%)]`,
              ];
              return patterns[patternVariation];
            };

            const getBulletColor = () => {
              const colorMap = {
                primary: "bg-primary",
                blue: "bg-blue",
                green: "bg-green",
                red: "bg-red",
                orange: "bg-orange",
                yellow: "bg-yellow",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getGoalBorderColor = () => {
              const colorMap = {
                primary: "border-primary/20",
                blue: "border-blue/20",
                green: "border-green/20",
                red: "border-red/20",
                orange: "border-orange/20",
                yellow: "border-yellow/20",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getGoalTextColor = () => {
              const colorMap = {
                primary: "text-primary",
                blue: "text-blue",
                green: "text-green",
                red: "text-red",
                orange: "text-orange",
                yellow: "text-yellow",
              };
              return colorMap[color] || colorMap.primary;
            };

            const getGoalAccentColor = () => {
              if (color === "primary") {
                return "bg-linear-to-r from-primary to-secondary";
              }
              const colorMap: Record<
                "blue" | "green" | "red" | "orange" | "yellow",
                string
              > = {
                blue: "bg-linear-to-r from-blue to-blue/80",
                green: "bg-linear-to-r from-green to-green/80",
                red: "bg-linear-to-r from-red to-red/80",
                orange: "bg-linear-to-r from-orange to-orange/80",
                yellow: "bg-linear-to-r from-yellow to-yellow/80",
              };
              return (
                colorMap[color] || "bg-linear-to-r from-primary to-secondary"
              );
            };

            const getDecorativeAccentColor = (opacity: string = "10") => {
              const colorMap = {
                primary: {
                  "10": "from-primary/10",
                  "8": "from-primary/8",
                  "5": "from-primary/5",
                },
                blue: {
                  "10": "from-blue/10",
                  "8": "from-blue/8",
                  "5": "from-blue/5",
                },
                green: {
                  "10": "from-green/10",
                  "8": "from-green/8",
                  "5": "from-green/5",
                },
                red: {
                  "10": "from-red/10",
                  "8": "from-red/8",
                  "5": "from-red/5",
                },
                orange: {
                  "10": "from-orange/10",
                  "8": "from-orange/8",
                  "5": "from-orange/5",
                },
                yellow: {
                  "10": "from-yellow/10",
                  "8": "from-yellow/8",
                  "5": "from-yellow/5",
                },
              };
              return (
                colorMap[color]?.[opacity as "10" | "8" | "5"] ||
                colorMap.primary[opacity as "10" | "8" | "5"]
              );
            };

            const getDecorativeViaColor = () => {
              if (color === "primary") {
                return "via-secondary/5";
              }
              const colorMap = {
                blue: "via-blue/5",
                green: "via-green/5",
                red: "via-red/5",
                orange: "via-orange/5",
                yellow: "via-yellow/5",
              };
              return colorMap[color] || "via-transparent";
            };

            return (
              <AnimatedWrapper
                key={index}
                delay={index * 0.1}
                direction="up"
                className={twMerge(
                  "w-full de:w-[calc(50%-2rem)] xl:w-[340px]",
                  "h-full shrink-0 relative",
                )}
              >
                <div
                  className={twMerge(
                    "relative flex flex-col items-start rounded-4xl",
                    "bg-linear-to-br from-dark via-dark/95 to-dark/90",
                    "border-2",
                    getBorderColor(),
                    "shadow-lg",
                    getShadowColor(),
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
                          getLabelGradient(),
                          "border-2 border-dark",
                          "text-white font-bold text-[12px] uppercase tracking-wider",
                          "shadow-xl",
                          getLabelShadow(),
                        )}
                      >
                        <span className="relative z-10">{level.label}</span>
                        {/* Corner notch effect */}
                        <div
                          className={twMerge(
                            "absolute -bottom-1 -right-1 w-3 h-3",
                            "bg-dark rotate-45",
                            "border-r border-b",
                            getLabelBorder(),
                          )}
                        />
                      </div>
                    </AnimatedWrapper>
                  )}

                  {/* Gradient overlay - varies by level */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-4xl opacity-100",
                      getGradientOverlay(),
                    )}
                  />

                  {/* Background pattern - varies by level */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-4xl opacity-10",
                      getBackgroundPattern(),
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
                                    getBulletColor(),
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
                          "border-t-2",
                          getGoalBorderColor(),
                        )}
                      >
                        <div
                          className={twMerge(
                            "absolute left-0 top-0 w-8 h-0.5",
                            getGoalAccentColor(),
                            "opacity-0",
                          )}
                        />
                        <p
                          className={twMerge(
                            "text-white/80 text-[16px] leading-relaxed italic",
                          )}
                        >
                          <span
                            className={twMerge("font-bold", getGoalTextColor())}
                          >
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
                          "bg-linear-to-tr",
                          getDecorativeAccentColor("10"),
                          "to-transparent",
                          "rounded-tl-full",
                        )}
                      />
                      {/* Top right */}
                      <div
                        className={twMerge(
                          "absolute top-0 right-0 w-32 h-32",
                          "bg-linear-to-bl",
                          getDecorativeAccentColor("10"),
                          "to-transparent",
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
                          "bg-linear-to-br",
                          getDecorativeAccentColor("10"),
                          "to-transparent",
                          "rounded-br-full",
                        )}
                      />
                      {/* Bottom left */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-0 w-40 h-40",
                          "bg-linear-to-tr",
                          getDecorativeAccentColor("10"),
                          "to-transparent",
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
                          "bg-linear-to-b",
                          getDecorativeAccentColor("10"),
                          getDecorativeViaColor(),
                          "to-transparent",
                          "rounded-b-full",
                        )}
                      />
                      {/* Bottom corners */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-0 w-36 h-36",
                          "bg-linear-to-tr",
                          getDecorativeAccentColor("8"),
                          "to-transparent",
                          "rounded-tr-full",
                        )}
                      />
                      <div
                        className={twMerge(
                          "absolute bottom-0 right-0 w-36 h-36",
                          "bg-linear-to-tl",
                          getDecorativeAccentColor("8"),
                          "to-transparent",
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
                          "bg-linear-to-r",
                          getDecorativeAccentColor("10"),
                          getDecorativeViaColor(),
                          "to-transparent",
                          "rounded-r-full",
                        )}
                      />
                      {/* Right side */}
                      <div
                        className={twMerge(
                          "absolute right-0 top-1/4 w-32 h-64",
                          "bg-linear-to-l",
                          getDecorativeAccentColor("10"),
                          "to-transparent",
                          "rounded-l-full",
                        )}
                      />
                      {/* Bottom center */}
                      <div
                        className={twMerge(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32",
                          "bg-linear-to-t",
                          getDecorativeAccentColor("8"),
                          "to-transparent",
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
