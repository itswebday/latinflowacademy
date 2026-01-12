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
  subtitle?: string;
  price: string;
  description: ReactNode;
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
  subtitle,
  price,
  description,
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
      primary: "border-primary/30 shadow-primary/10",
      blue: "border-blue/30 shadow-blue/10",
      green: "border-green/30 shadow-green/10",
      red: "border-red/30 shadow-red/10",
      orange: "border-orange/30 shadow-orange/10",
      yellow: "border-yellow/30 shadow-yellow/10",
    };
    return colorMap[color] || colorMap.primary;
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

  return (
    <div
      className={twMerge(
        "relative flex flex-col items-start rounded-3xl",
        "bg-white/5 backdrop-blur-sm border",
        "shadow-lg",
        mostPopular && "border-2 scale-105 z-10",
        !mostPopular && getColorClasses(),
        mostPopular &&
          color === "primary" &&
          "border-primary/50 shadow-primary/20",
        mostPopular && color === "blue" && "border-blue/50 shadow-blue/20",
        mostPopular && color === "green" && "border-green/50 shadow-green/20",
        mostPopular && color === "red" && "border-red/50 shadow-red/20",
        mostPopular &&
          color === "orange" &&
          "border-orange/50 shadow-orange/20",
        mostPopular &&
          color === "yellow" &&
          "border-yellow/50 shadow-yellow/20",
        "h-full overflow-visible",
      )}
    >
      {/* Most Popular badge */}
      {mostPopular && (
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
      {discount !== undefined && discount !== null && discount > 0 && (
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
            <span className="relative z-10">{discount}% OFF</span>
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
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={twMerge(
              "relative z-10 text-white/60 text-[16px] leading-relaxed",
            )}
          >
            {subtitle}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-3">
          {newPrice &&
          discount !== undefined &&
          discount !== null &&
          discount > 0 ? (
            <>
              <span
                className={twMerge(
                  "text-[20px] font-semibold line-through text-white/50",
                )}
              >
                {price}
              </span>
              <span className={twMerge("text-[32px] font-bold text-white")}>
                {newPrice}
              </span>
            </>
          ) : (
            <span className={twMerge("text-[32px] font-bold text-white")}>
              {price}
            </span>
          )}
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

        {/* Buttons */}
        <div className="mt-auto w-full pt-4">
          {hasUrl ? (
            <ButtonLink
              variant="primaryButton"
              href={button.url!}
              target="_blank"
              className="w-fit"
            >
              {button.text}
            </ButtonLink>
          ) : (
            <>
              <Button
                variant="primaryButton"
                onClick={() => setIsModalOpen(true)}
                className="w-fit"
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
