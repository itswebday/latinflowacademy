"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { Button, ButtonLink } from "@/components";
import { CheckIcon } from "@/components/icons";
import SubscriptionModal from "../SubscriptionModal";
import type { Config } from "@/payload-types";
import type { ReactNode } from "react";

type PriceCardProps = {
  title: string;
  description: ReactNode;
  priceLabel?: string;
  price: string;
  discount?: number;
  newPrice?: string;
  details: { detail: string }[];
  button: Config["globals"]["prices"]["memberships"][number]["button"];
  options: Array<{ price: string; text: string; url: string }>;
  style: {
    color?: "primary" | "blue" | "green" | "red" | "orange" | "yellow";
    mostPopular?: boolean;
  };
};

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  description,
  priceLabel,
  price,
  discount,
  newPrice,
  details,
  button,
  options,
  style,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasUrl = button.url && button.url.trim() !== "";
  const pricesT = useTranslations("prices");
  const color = style.color || "primary";
  const mostPopular = style.mostPopular || false;

  const getColorClasses = () => {
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
    return colorMap[color] || colorMap.primary;
  };

  const getBulletColor = () => {
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
    const colorMap = {
      primary: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
      blue: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
      green: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
      red: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
      orange: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
      yellow: "bg-linear-to-br from-dark via-dark/95 to-dark/90",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getGradientOverlay = () => {
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
    <div
      className={twMerge(
        "group relative flex flex-col items-start rounded-4xl overflow-hidden",
        getBackgroundGradient(),
        "border backdrop-blur-sm",
        "shadow-xl transition-all duration-300 ease-out",
        "hover:shadow-2xl",
        mostPopular && "border-2 z-10",
        !mostPopular && getColorClasses(),
        mostPopular &&
          color === "primary" &&
          "border-primary/70 shadow-2xl shadow-primary/30 hover:border-primary/80 hover:shadow-primary/40",
        mostPopular &&
          color === "blue" &&
          "border-blue/70 shadow-2xl shadow-blue/30 hover:border-blue/80 hover:shadow-blue/40",
        mostPopular &&
          color === "green" &&
          "border-green/70 shadow-2xl shadow-green/30 hover:border-green/80 hover:shadow-green/40",
        mostPopular &&
          color === "red" &&
          "border-red/70 shadow-2xl shadow-red/30 hover:border-red/80 hover:shadow-red/40",
        mostPopular &&
          color === "orange" &&
          "border-orange/70 shadow-2xl shadow-orange/30 hover:border-orange/80 hover:shadow-orange/40",
        mostPopular &&
          color === "yellow" &&
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
          mostPopular && "opacity-100",
        )}
      />

      {/* Enhanced glow for most popular */}
      {mostPopular && (
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
      {mostPopular && (
        <div
          className={twMerge(
            "absolute inset-0 rounded-4xl",
            color === "primary" &&
              "bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20",
            color === "blue" &&
              "bg-linear-to-r from-blue/20 via-blue/15 to-blue/20",
            color === "green" &&
              "bg-linear-to-r from-green/20 via-green/15 to-green/20",
            color === "red" &&
              "bg-linear-to-r from-red/20 via-red/15 to-red/20",
            color === "orange" &&
              "bg-linear-to-r from-orange/20 via-orange/15 to-orange/20",
            color === "yellow" &&
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
        {mostPopular && (
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
        {discount !== undefined && discount !== null && discount > 0 && (
          <div
            className={twMerge(
              "px-4 py-1.5 rounded-bl-2xl",
              mostPopular ? "rounded-tr-none" : "rounded-tr-4xl",
              getMostPopularBadgeColor(),
              "border-b border-l",
              mostPopular ? "border-r border-white/50" : "border-white/50",
              "text-white font-bold text-[11px] uppercase tracking-wider",
              "shadow-lg",
              color === "primary" && "shadow-primary/40",
              color === "blue" && "shadow-blue/40",
              color === "green" && "shadow-green/40",
              color === "red" && "shadow-red/40",
              color === "orange" && "shadow-orange/40",
              color === "yellow" && "shadow-yellow/40",
            )}
          >
            {discount}% OFF
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
      <div className="relative z-10 flex flex-col items-start gap-6 pl-10 pt-14 pr-8 pb-12 w-full flex-1">
        {/* Title */}
        <h3
          className={twMerge(
            "text-[22px] de:text-[26px] font-bold text-white leading-tight",
            "transition-colors duration-300",
            color === "primary" && "group-hover:text-primary",
            color === "blue" && "group-hover:text-blue",
            color === "green" && "group-hover:text-green",
            color === "red" && "group-hover:text-red",
            color === "orange" && "group-hover:text-orange",
            color === "yellow" && "group-hover:text-yellow",
            "mb-1",
          )}
        >
          {title}
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
        {priceLabel && (
          <p
            className={twMerge(
              "text-white/70 text-[16px] leading-relaxed -mb-5",
            )}
          >
            {priceLabel}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3">
          {newPrice &&
          discount !== undefined &&
          discount !== null &&
          discount > 0 ? (
            <>
              <span
                className={twMerge(
                  "text-[20px] font-semibold line-through text-white/40",
                )}
              >
                {price}
              </span>
              <span
                className={twMerge(
                  "text-[32px] de:text-[36px] font-bold",
                  getPriceGradient(),
                  color !== "primary" && "bg-clip-text text-transparent",
                )}
              >
                {newPrice}
              </span>
            </>
          ) : (
            <span
              className={twMerge(
                "text-[32px] de:text-[36px] font-bold",
                getPriceGradient(),
                color !== "primary" && "bg-clip-text text-transparent",
              )}
            >
              {price}
            </span>
          )}
        </div>

        {/* Details */}
        <ul className={twMerge("flex flex-col gap-3 w-full", "list-none")}>
          {details.map((detail, detailIndex) => {
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

        {/* Buttons */}
        <div className="mt-auto w-full pt-4">
          {hasUrl ? (
            <ButtonLink
              variant="primaryButton"
              href={button.url!}
              target="_blank"
              className={twMerge("w-fit", getButtonStyles())}
            >
              {button.text}
            </ButtonLink>
          ) : (
            <>
              <Button
                variant="primaryButton"
                onClick={() => setIsModalOpen(true)}
                className={twMerge("w-fit", getButtonStyles())}
              >
                {button.text}
              </Button>
              <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                options={options}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
