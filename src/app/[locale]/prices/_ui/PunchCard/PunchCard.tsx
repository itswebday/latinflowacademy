"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, Button, ButtonLink, Modal } from "@/components";
import { CheckIcon } from "@/components/icons";
import type { Config } from "@/payload-types";
import type { ReactNode } from "react";

type PunchCardProps = {
  punchCard: NonNullable<
    NonNullable<Config["globals"]["prices"]>["punchCards"]
  >[number];
  description: ReactNode;
  index: number;
};

const PunchCard: React.FC<PunchCardProps> = ({
  punchCard,
  description,
  index,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pricesT = useTranslations("prices");
  const hasUrl = punchCard.button?.url && punchCard.button.url.trim() !== "";

  const getColorClasses = () => {
    const color = punchCard.style?.color || "primary";
    const colorMap = {
      primary: "border-primary/30 shadow-primary/10",
      blue: "border-blue/30 shadow-blue/10",
      green: "border-green/30 shadow-green/10",
      red: "border-red/30 shadow-red/10",
      orange: "border-orange/30 shadow-orange/10",
      yellow: "border-yellow/30 shadow-yellow/10",
    };

    if (punchCard.style?.mostPopular) {
      const popularColorMap = {
        primary: "border-primary/50 shadow-primary/20",
        blue: "border-blue/50 shadow-blue/20",
        green: "border-green/50 shadow-green/20",
        red: "border-red/50 shadow-red/20",
        orange: "border-orange/50 shadow-orange/20",
        yellow: "border-yellow/50 shadow-yellow/20",
      };
      return popularColorMap[color] || popularColorMap.primary;
    }

    return colorMap[color] || colorMap.primary;
  };

  const getBulletColor = () => {
    const color = punchCard.style?.color || "primary";
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

  const getMostPopularBadgeColor = () => {
    const color = punchCard.style?.color || "primary";
    const colorMap = {
      primary: "bg-linear-to-br from-primary to-secondary",
      blue: "bg-linear-to-br from-blue to-blue/80",
      green: "bg-linear-to-br from-green to-green/80",
      red: "bg-linear-to-br from-red to-red/80",
      orange: "bg-linear-to-br from-orange to-orange/80",
      yellow: "bg-linear-to-br from-yellow to-yellow/80",
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <AnimatedWrapper
      delay={0.3 + index * 0.1}
      direction="up"
      className="h-full"
    >
      <div
        className={twMerge(
          "relative flex flex-col items-start rounded-3xl",
          "bg-white/5 backdrop-blur-sm border",
          "shadow-lg",
          punchCard.style?.mostPopular && "border-2 scale-105 z-10",
          getColorClasses(),
          "h-full overflow-visible",
        )}
      >
        {/* Most Popular badge */}
        {punchCard.style?.mostPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div
              className={twMerge(
                "relative px-5 py-2 rounded-lg",
                getMostPopularBadgeColor(),
                "border-2 border-white",
                "text-white font-bold text-[12px] uppercase tracking-wider",
                "shadow-xl",
              )}
            >
              <span className="relative z-10">{pricesT("mostPopular")}</span>
            </div>
          </div>
        )}

        {/* Discount badge */}
        {punchCard.discount !== undefined &&
          punchCard.discount !== null &&
          punchCard.discount > 0 && (
            <div className="absolute -top-3 -right-3 z-20">
              <div
                className={twMerge(
                  "relative px-5 py-2 rounded-lg",
                  "bg-linear-to-br from-primary to-secondary",
                  "border-2 border-white",
                  "text-white font-bold text-[12px] uppercase tracking-wider",
                  "shadow-xl shadow-primary/40",
                )}
              >
                <span className="relative z-10">€{punchCard.discount} OFF</span>
              </div>
            </div>
          )}

        {/* Content wrapper */}
        <div className="flex flex-col items-start gap-6 px-8 pt-10 pb-8 w-full flex-1">
          {/* Title */}
          <h3
            className={twMerge(
              "relative z-10 text-[24px] font-bold text-white leading-tight",
            )}
          >
            {punchCard.title}
          </h3>

          {/* Subtitle */}
          {punchCard.subtitle && (
            <p
              className={twMerge(
                "relative z-10 text-white/60 text-[16px] leading-relaxed",
              )}
            >
              {punchCard.subtitle}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            {punchCard.discount !== undefined &&
              punchCard.discount !== null &&
              punchCard.discount > 0 &&
              punchCard.price && (
                <span
                  className={twMerge(
                    "text-[20px] font-semibold line-through text-white/50",
                  )}
                >
                  {punchCard.price}
                </span>
              )}
            <span className={twMerge("text-[32px] font-bold text-white")}>
              {punchCard.discount !== undefined &&
              punchCard.discount !== null &&
              punchCard.discount > 0 &&
              punchCard.newPrice
                ? punchCard.newPrice
                : punchCard.price}
            </span>
          </div>

          {/* Description */}
          <div
            className={twMerge(
              "relative z-10 text-white/60 text-[16px] leading-relaxed",
            )}
          >
            {description}
          </div>

          {/* Details */}
          <ul
            className={twMerge(
              "relative z-10 flex flex-col gap-3 w-full",
              "list-none",
            )}
          >
            {punchCard.details.map((detail, detailIndex) => {
              if (!detail.detail) {
                return null;
              }

              return (
                <li
                  key={detailIndex}
                  className={twMerge(
                    "flex items-center gap-4",
                    "text-white/90 leading-relaxed",
                  )}
                >
                  {/* Check icon */}
                  <div
                    className={twMerge(
                      "shrink-0 w-5 h-5 flex items-center justify-center rounded-full",
                      getBulletColor(),
                    )}
                  >
                    <CheckIcon className="w-3 h-3 text-white" />
                  </div>
                  <span>{detail.detail}</span>
                </li>
              );
            })}
          </ul>

          {/* Button */}
          <div className="mt-auto w-full pt-4">
            {hasUrl ? (
              <ButtonLink
                variant="primaryButton"
                href={punchCard.button.url!}
                target="_blank"
                className="w-fit"
              >
                {punchCard.button.text}
              </ButtonLink>
            ) : (
              <>
                <Button
                  variant="primaryButton"
                  onClick={() => setIsModalOpen(true)}
                  className="w-fit"
                >
                  {punchCard.button.text}
                </Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div className="flex flex-col gap-6">
                    <h3 className="text-white text-[24px] font-bold">
                      {punchCard.title}
                    </h3>
                    <div className="text-white/80 text-[16px]">
                      <p>Contact us to purchase this punch card.</p>
                    </div>
                  </div>
                </Modal>
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default PunchCard;
