"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { Button, ButtonLink, Modal } from "@/components";
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
      primary:
        "border-primary/30 shadow-primary/10 hover:border-primary/50 hover:shadow-primary/20",
      blue: "border-blue/30 shadow-blue/10 hover:border-blue/50 hover:shadow-blue/20",
      green:
        "border-green/30 shadow-green/10 hover:border-green/50 hover:shadow-green/20",
      red: "border-red/30 shadow-red/10 hover:border-red/50 hover:shadow-red/20",
      orange:
        "border-orange/30 shadow-orange/10 hover:border-orange/50 hover:shadow-orange/20",
      yellow:
        "border-yellow/30 shadow-yellow/10 hover:border-yellow/50 hover:shadow-yellow/20",
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
      primary: "text-primary",
      blue: "text-blue",
      green: "text-green",
      red: "text-red",
      orange: "text-orange",
      yellow: "text-yellow",
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

  const getPriceGradient = () => {
    const color = punchCard.style?.color || "primary";
    if (color === "primary") {
      return "text-primary";
    }
    const colorMap = {
      blue: "bg-linear-to-r from-blue to-blue/80",
      green: "bg-linear-to-r from-green to-green/80",
      red: "bg-linear-to-r from-red to-red/80",
      orange: "bg-linear-to-r from-orange to-orange/80",
      yellow: "bg-linear-to-r from-yellow to-yellow/80",
    };
    return colorMap[color] || "text-primary";
  };

  const getButtonStyles = () => {
    const color = punchCard.style?.color || "primary";
    const colorMap = {
      primary:
        "text-white bg-linear-to-r from-primary to-secondary shadow-primary/30 hover:shadow-primary/40",
      blue: "text-white bg-linear-to-r from-blue to-blue/80 shadow-blue/30 hover:shadow-blue/40",
      green:
        "text-white bg-linear-to-r from-green to-green/80 shadow-green/30 hover:shadow-green/40",
      red: "text-white bg-linear-to-r from-red to-red/80 shadow-red/30 hover:shadow-red/40",
      orange:
        "text-white bg-linear-to-r from-orange to-orange/80 shadow-orange/30 hover:shadow-orange/40",
      yellow:
        "text-white bg-linear-to-r from-yellow to-yellow/80 shadow-yellow/30 hover:shadow-yellow/40",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getBackgroundGradient = () => {
    return "bg-linear-to-br from-dark via-dark/95 to-dark/90";
  };

  const getGradientOverlay = () => {
    const color = punchCard.style?.color || "primary";
    const colorMap = {
      primary:
        "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
      blue: "bg-linear-to-br from-blue/10 via-transparent to-blue/5",
      green: "bg-linear-to-br from-green/10 via-transparent to-green/5",
      red: "bg-linear-to-br from-red/10 via-transparent to-red/5",
      orange: "bg-linear-to-br from-orange/10 via-transparent to-orange/5",
      yellow: "bg-linear-to-br from-yellow/10 via-transparent to-yellow/5",
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="h-full">
      <div
        className={twMerge(
          "group relative flex flex-col items-start rounded-4xl overflow-hidden",
          getBackgroundGradient(),
          "border backdrop-blur-sm",
          "shadow-xl transition-all duration-300 ease-out",
          "hover:shadow-2xl",
          punchCard.style?.mostPopular && "border-2 z-10",
          getColorClasses(),
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "primary" &&
            "border-primary/70 shadow-2xl shadow-primary/30 hover:border-primary/80 hover:shadow-primary/40",
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "blue" &&
            "border-blue/70 shadow-2xl shadow-blue/30 hover:border-blue/80 hover:shadow-blue/40",
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "green" &&
            "border-green/70 shadow-2xl shadow-green/30 hover:border-green/80 hover:shadow-green/40",
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "red" &&
            "border-red/70 shadow-2xl shadow-red/30 hover:border-red/80 hover:shadow-red/40",
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "orange" &&
            "border-orange/70 shadow-2xl shadow-orange/30 hover:border-orange/80 hover:shadow-orange/40",
          punchCard.style?.mostPopular &&
            punchCard.style?.color === "yellow" &&
            "border-yellow/70 shadow-2xl shadow-yellow/30 hover:border-yellow/80 hover:shadow-yellow/40",
          "h-full",
        )}
      >
        {/* Gradient overlay */}
        <div
          className={twMerge(
            "absolute inset-0 rounded-4xl",
            getGradientOverlay(),
            "transition-opacity duration-300 ease-out",
            "group-hover:opacity-100",
            punchCard.style?.mostPopular && "opacity-100",
          )}
        />

        {/* Enhanced glow for most popular */}
        {punchCard.style?.mostPopular && (
          <div
            className={twMerge(
              "absolute -inset-4 rounded-4xl",
              "bg-linear-to-r from-primary/15 to-secondary/15",
              "blur-3xl opacity-40 -z-10",
              "transition-all duration-300 ease-out",
              "group-hover:opacity-50",
            )}
            aria-hidden="true"
          />
        )}

        {/* Animated border glow for most popular */}
        {punchCard.style?.mostPopular && (
          <div
            className={twMerge(
              "absolute inset-0 rounded-4xl",
              punchCard.style?.color === "primary" &&
                "bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20",
              punchCard.style?.color === "blue" &&
                "bg-linear-to-r from-blue/20 via-blue/15 to-blue/20",
              punchCard.style?.color === "green" &&
                "bg-linear-to-r from-green/20 via-green/15 to-green/20",
              punchCard.style?.color === "red" &&
                "bg-linear-to-r from-red/20 via-red/15 to-red/20",
              punchCard.style?.color === "orange" &&
                "bg-linear-to-r from-orange/20 via-orange/15 to-orange/20",
              punchCard.style?.color === "yellow" &&
                "bg-linear-to-r from-yellow/20 via-yellow/15 to-yellow/20",
              "blur-xl opacity-30",
              "animate-pulse",
            )}
            aria-hidden="true"
          />
        )}
        {/* Badges container */}
        <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
          {/* Most Popular badge */}
          {punchCard.style?.mostPopular && (
            <div
              className={twMerge(
                "relative px-5 py-2 rounded-bl-2xl rounded-tr-4xl",
                getMostPopularBadgeColor(),
                "border-b border-l border-white/60",
                "text-white font-bold text-[12px] uppercase tracking-widest",
                "shadow-xl",
                "backdrop-blur-sm",
              )}
            >
              {/* Shine effect */}
              <div
                className={twMerge(
                  "absolute inset-0 rounded-bl-2xl rounded-tr-4xl",
                  "bg-linear-to-r from-transparent via-white/20 to-transparent",
                  "opacity-50",
                )}
                aria-hidden="true"
              />
              <span className="relative z-10">{pricesT("mostPopular")}</span>
            </div>
          )}

          {/* Discount badge */}
          {punchCard.discount !== undefined &&
            punchCard.discount !== null &&
            punchCard.discount > 0 && (
              <div
                className={twMerge(
                  "px-4 py-1.5 rounded-bl-2xl",
                  punchCard.style?.mostPopular
                    ? "rounded-tr-none"
                    : "rounded-tr-4xl",
                  getMostPopularBadgeColor(),
                  "border-b border-l",
                  punchCard.style?.mostPopular
                    ? "border-r border-white/50"
                    : "border-white/50",
                  "text-white font-bold text-[11px] uppercase tracking-wider",
                  "shadow-lg",
                  punchCard.style?.color === "primary" && "shadow-primary/40",
                  punchCard.style?.color === "blue" && "shadow-blue/40",
                  punchCard.style?.color === "green" && "shadow-green/40",
                  punchCard.style?.color === "red" && "shadow-red/40",
                  punchCard.style?.color === "orange" && "shadow-orange/40",
                  punchCard.style?.color === "yellow" && "shadow-yellow/40",
                )}
              >
                €{punchCard.discount} OFF
              </div>
            )}
        </div>

        {/* Decorative corner accent */}
        <div
          className={twMerge(
            "absolute bottom-0 right-0 w-32 h-32",
            "bg-linear-to-tr from-primary/15 to-transparent",
            "rounded-tl-full",
            "transition-all duration-300 ease-out",
            "group-hover:w-36 group-hover:h-36 group-hover:from-primary/20",
          )}
          aria-hidden="true"
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col items-start gap-6 pl-10 pt-14 pr-8 pb-10 w-full flex-1">
          {/* Title */}
          <h3
            className={twMerge(
              "text-[22px] de:text-[26px] font-bold text-white leading-tight",
              "transition-colors duration-300",
              punchCard.style?.color === "primary" &&
                "group-hover:text-primary",
              punchCard.style?.color === "blue" && "group-hover:text-blue",
              punchCard.style?.color === "green" && "group-hover:text-green",
              punchCard.style?.color === "red" && "group-hover:text-red",
              punchCard.style?.color === "orange" && "group-hover:text-orange",
              punchCard.style?.color === "yellow" && "group-hover:text-yellow",
              "mb-1",
            )}
          >
            {punchCard.title}
          </h3>

          {/* Description */}
          <div
            className={twMerge(
              "text-white/70 text-[16px] leading-relaxed",
              "transition-colors duration-300 mt-2 mb-1",
            )}
          >
            {description}
          </div>

          {/* Price label (optional) */}
          {punchCard.priceLabel && (
            <p
              className={twMerge(
                "text-white/70 text-[16px] leading-relaxed -mb-5",
              )}
            >
              {punchCard.priceLabel}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            {punchCard.newPrice &&
            punchCard.discount !== undefined &&
            punchCard.discount !== null &&
            punchCard.discount > 0 ? (
              <>
                <span
                  className={twMerge(
                    "text-[20px] font-semibold line-through text-white/40",
                  )}
                >
                  {punchCard.price}
                </span>
                <span
                  className={twMerge(
                    "text-[32px] de:text-[36px] font-bold",
                    getPriceGradient(),
                    punchCard.style?.color !== "primary" &&
                      "bg-clip-text text-transparent",
                  )}
                >
                  {punchCard.newPrice}
                </span>
              </>
            ) : (
              <span
                className={twMerge(
                  "text-[32px] de:text-[36px] font-bold",
                  getPriceGradient(),
                  punchCard.style?.color !== "primary" &&
                    "bg-clip-text text-transparent",
                )}
              >
                {punchCard.price}
              </span>
            )}
          </div>

          {/* Details */}
          <ul className={twMerge("flex flex-col gap-3 w-full", "list-none")}>
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
                  <CheckIcon
                    className={twMerge("shrink-0 w-5 h-5", getBulletColor())}
                  />
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
                className={twMerge("w-fit", getButtonStyles())}
              >
                {punchCard.button.text}
              </ButtonLink>
            ) : (
              <>
                <Button
                  variant="primaryButton"
                  onClick={() => setIsModalOpen(true)}
                  className={twMerge("w-fit", getButtonStyles())}
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
    </div>
  );
};

export default PunchCard;
