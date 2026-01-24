"use client";

import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { getMediaUrlAndAlt, processText } from "@/utils";
import type { ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  icon?: number | { id?: number | null; url?: string | null } | null;
  content: ReactNode;
};

type PricesTabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

const PricesTabs: React.FC<PricesTabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Tabs Navigation - Fancy button style */}
      <div className="relative mb-12 de:mb-16">
        {/* Tab buttons container */}
        <div
          className={twMerge(
            "relative flex items-center justify-center",
            "gap-4 xs:gap-6 de:gap-8",
            "flex-wrap",
          )}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const { url: iconUrl, alt: iconAlt } = tab.icon
              ? getMediaUrlAndAlt(tab.icon)
              : { url: undefined, alt: "" };

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={twMerge(
                  "group relative flex items-center gap-3",
                  "px-6 py-4 xs:px-8 xs:py-5 de:px-10 de:py-6",
                  "rounded-2xl xs:rounded-3xl",
                  "transition-all duration-500 ease-out",
                  "overflow-hidden",
                  "border-2",
                  isActive
                    ? "border-primary/50 bg-dark/80 backdrop-blur-md shadow-2xl shadow-primary/30"
                    : "border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20",
                )}
                aria-selected={isActive}
                role="tab"
              >
                {/* Animated border glow for active tab */}
                {isActive && (
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-2xl xs:rounded-3xl",
                      "bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20",
                      "blur-md opacity-60",
                      "animate-pulse",
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Gradient border effect for active tab */}
                {isActive && (
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-2xl xs:rounded-3xl",
                      "bg-linear-to-r from-primary/30 via-transparent to-secondary/30",
                      "opacity-40",
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Shine effect on hover */}
                {!isActive && (
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-2xl xs:rounded-3xl",
                      "bg-linear-to-r from-transparent via-white/10 to-transparent",
                      "opacity-0 transition-opacity duration-500 ease-out",
                      "group-hover:opacity-100",
                      "-translate-x-full group-hover:translate-x-full",
                    )}
                    style={{
                      transition:
                        "opacity 0.5s ease-out, transform 0.7s ease-out",
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Glow effect behind active tab */}
                {isActive && (
                  <div
                    className={twMerge(
                      "absolute -inset-3 rounded-2xl xs:rounded-3xl",
                      "bg-linear-to-r from-primary/20 to-secondary/20",
                      "blur-2xl opacity-50 -z-10",
                      "transition-all duration-500 ease-out",
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Icon */}
                {iconUrl && (
                  <span
                    className={twMerge(
                      "relative shrink-0 z-10",
                      "w-6 h-6 xs:w-7 xs:h-7 de:w-8 de:h-8",
                      "transition-all duration-300 ease-out",
                      isActive
                        ? "opacity-100 scale-110"
                        : "opacity-70 group-hover:opacity-100 group-hover:scale-105",
                    )}
                  >
                    <Image
                      className="object-contain"
                      src={iconUrl}
                      alt={iconAlt || tab.label}
                      fill={true}
                      sizes="32px"
                    />
                  </span>
                )}

                {/* Text */}
                <span
                  className={twMerge(
                    "relative z-10 font-bold",
                    "text-[16px] xs:text-[18px] de:text-[20px]",
                    "transition-all duration-300 ease-out",
                    isActive
                      ? "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent scale-105"
                      : "text-white/70 group-hover:text-white group-hover:scale-105",
                  )}
                >
                  {processText(tab.label)}
                </span>

                {/* Animated corner accents for active tab */}
                {isActive && (
                  <>
                    <div
                      className={twMerge(
                        "absolute top-1 right-1 w-2 h-2 rounded-full",
                        "bg-primary blur-sm",
                        "animate-pulse",
                      )}
                      aria-hidden="true"
                    />
                    <div
                      className={twMerge(
                        "absolute bottom-1 left-1 w-2 h-2 rounded-full",
                        "bg-secondary blur-sm",
                        "animate-pulse",
                        "delay-150",
                      )}
                      style={{ animationDelay: "150ms" }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with fade animation */}
      <div className="relative min-h-[400px]">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={twMerge(
              "transition-all duration-700 ease-out",
              tab.id === activeTab
                ? "opacity-100 visible relative translate-y-0"
                : "opacity-0 invisible absolute inset-0 translate-y-4",
            )}
            role="tabpanel"
            aria-hidden={tab.id !== activeTab}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricesTabs;
