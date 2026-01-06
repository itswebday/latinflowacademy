"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "@/components/icons";

type TabsProps = {
  className?: string;
  tabsClassName?: string;
  tabs: {
    label: string;
    children: React.ReactNode;
  }[];
  tabsOnTheSide?: boolean;
  dropdownTabsMobile?: boolean;
};

const Tabs: React.FC<TabsProps> = ({
  className,
  tabsClassName,
  tabs,
  tabsOnTheSide = false,
  dropdownTabsMobile = false,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "flex",
        tabsOnTheSide ? "flex-col de:flex-row" : "flex-col",
        className,
      )}
    >
      {/* Dropdown tabs for mobile screens */}
      {dropdownTabsMobile && (
        <div className="relative justify-between w-full mb-12 de:hidden">
          {/* Active tab */}
          <button
            className={twMerge(
              "flex items-center justify-between w-full px-4 py-3",
              "text-gray font-medium bg-white",
              "border-b-2 border-light",
            )}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Label */}
            <span>{tabs[activeTabIndex].label}</span>

            {/* Arrow */}
            <ChevronDown
              className={twMerge(
                "relative w-4 h-4 transition-transform duration-200",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              className={twMerge(
                "z-10 absolute w-full top-full left-0 bg-white",
                "border border-light shadow-lg",
              )}
            >
              {/* Tabs */}
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={twMerge(
                    "w-full text-left px-6 py-4 hover:bg-primary/20",
                    activeTabIndex === index
                      ? "text-black font-medium"
                      : "text-gray",
                  )}
                  onClick={() => {
                    setActiveTabIndex(index);
                    setIsDropdownOpen(false);
                  }}
                >
                  {/* Label */}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div
        className={twMerge(
          "border-light",
          tabsOnTheSide
            ? twMerge(
                "border-r",
                dropdownTabsMobile
                  ? "hidden de:flex de:flex-col"
                  : "flex flex-col",
              )
            : twMerge("border-b", dropdownTabsMobile && "hidden de:flex"),
          !dropdownTabsMobile && !tabsOnTheSide && "flex",
          tabsClassName,
        )}
      >
        {/* Buttons */}
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={twMerge(
              "z-20 font-medium bg-white transition-all duration-200",
              tabsOnTheSide
                ? "px-6 py-11 text-right border-r-4"
                : "px-4 py-2 border-b-2",
              activeTabIndex === index
                ? twMerge(
                    "text-primary",
                    tabsOnTheSide
                      ? "border-r-primary font-semibold"
                      : "border-b-primary",
                  )
                : twMerge(
                    "text-gray hover:text-black",
                    tabsOnTheSide
                      ? "border-r-transparent"
                      : "border-b-transparent",
                  ),
            )}
            onClick={() => setActiveTabIndex(index)}
          >
            {/* Label */}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Children of the active tab */}
      {tabs[activeTabIndex].children}
    </div>
  );
};

export default Tabs;
