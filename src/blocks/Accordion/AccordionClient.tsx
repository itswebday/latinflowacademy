"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SwiperContainer } from "@/components";
import { ChevronDown } from "@/components/icons";

type AccordionClientProps = {
  className?: string;
  categorize?: boolean;
  items?: {
    summary: React.ReactNode;
    details: React.ReactNode;
  }[];
  categories?: {
    name: string;
    items: { summary: string; details: React.ReactNode }[];
  }[];
};

const AccordionClient: React.FC<AccordionClientProps> = ({
  className,
  categorize = false,
  items,
  categories,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const detailsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleCategoryChange = (categoryIndex: number) => {
    setActiveCategoryIndex(categoryIndex);
    setActiveIndex(null);
  };

  // Reset the height of all accordion items when the active index changes
  useEffect(() => {
    detailsRefs.current.forEach((ref, index) => {
      if (!ref) {
        return;
      }

      if (index === activeIndex) {
        ref.style.maxHeight = `${ref.scrollHeight}px`;
      } else {
        ref.style.maxHeight = "0px";
      }
    });
  }, [activeIndex]);

  // Render categorized accordion
  if (categorize && categories && categories.length > 0) {
    const activeCategory = categories[activeCategoryIndex];

    return (
      <div className={twMerge("flex flex-col gap-6 w-full", className)}>
        {/* Category Tabs */}
        <SwiperContainer
          spaceBetween={12}
          className="-mx-6 px-6 w-full"
          slideClassName="!w-auto"
        >
          {categories.map((category, categoryIndex: number) => {
            const isActive = activeCategoryIndex === categoryIndex;
            return (
              <button
                key={categoryIndex}
                type="button"
                onClick={() => handleCategoryChange(categoryIndex)}
                className={twMerge(
                  "group relative flex items-center gap-3",
                  "px-6 py-4 rounded-2xl",
                  "font-semibold text-[15px] whitespace-nowrap",
                  "transition-all duration-500 ease-out",
                  "overflow-hidden",
                  "border-2",
                  isActive
                    ? twMerge(
                        "bg-dark/80 border-primary/50 text-white",
                        "shadow-2xl shadow-primary/30",
                      )
                    : twMerge(
                        "bg-white/5 backdrop-blur-sm border-white/10 text-white/80",
                        "hover:bg-white/10 hover:border-white/20 hover:text-white",
                        "hover:shadow-lg hover:shadow-primary/10",
                      ),
                )}
              >
                {/* Single background circle on the left */}
                <div
                  className={twMerge(
                    "absolute left-0 top-1/2 -translate-y-1/2",
                    "w-16 h-16 rounded-full",
                    "transition-all duration-500 ease-out",
                    isActive
                      ? "bg-primary/20 blur-xl"
                      : "bg-white/5 blur-lg opacity-0 group-hover:opacity-100",
                  )}
                  aria-hidden="true"
                />

                {/* Tab text */}
                <span className="relative z-10">{category.name}</span>
              </button>
            );
          })}
        </SwiperContainer>

        {/* Active Category Items */}
        {activeCategory && (
          <div className="flex flex-col gap-4 w-full">
            {activeCategory.items.map((item, itemIndex) => {
              const isOpen = activeIndex === itemIndex;
              return (
                <div
                  key={itemIndex}
                  className={twMerge(
                    "group/item relative overflow-hidden rounded-3xl",
                    "bg-linear-to-br from-white/5 via-white/3 to-white/5",
                    "backdrop-blur-sm border border-white/10",
                    "transition-all duration-300 ease-out",
                    "hover:bg-white/10 hover:border-primary/40",
                    "hover:shadow-xl hover:shadow-primary/25",
                  )}
                >
                  {/* Background gradient overlay */}
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-3xl",
                      "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
                      "opacity-0 transition-opacity duration-300 ease-out",
                      "group-hover/item:opacity-100",
                      isOpen && "opacity-100",
                    )}
                    aria-hidden="true"
                  />

                  {/* Decorative corner accent */}
                  <div
                    className={twMerge(
                      "absolute bottom-0 right-0 w-24 h-24",
                      "bg-linear-to-tr from-primary/15 to-transparent",
                      "rounded-tl-full",
                      "transition-all duration-300 ease-out",
                      "group-hover/item:w-28 group-hover/item:h-28 group-hover/item:from-primary/20",
                      isOpen && "w-28 h-28 from-primary/20",
                    )}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => toggleItem(itemIndex)}
                    className={twMerge(
                      "relative z-10 w-full flex items-center justify-between",
                      "py-5 px-8 text-left",
                      "transition-all duration-300 ease-out",
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-details-${itemIndex}`}
                  >
                    <span
                      className={twMerge(
                        "font-medium text-white/90 text-[16px] pr-4",
                        "leading-snug",
                        "transition-colors duration-300 ease-out",
                        "group-hover/item:text-white",
                        isOpen && "text-white",
                      )}
                    >
                      {item.summary}
                    </span>
                    <div
                      className={twMerge(
                        "relative shrink-0",
                        "w-8 h-8 rounded-full",
                        "bg-white/10 border border-white/20",
                        "flex items-center justify-center",
                        "transition-all duration-300 ease-out",
                        "group-hover/item:bg-primary/20 group-hover/item:border-primary/40",
                        "group-hover/item:scale-110",
                        isOpen && "bg-primary/20 border-primary/40 scale-110",
                      )}
                      aria-hidden="true"
                    >
                      <ChevronDown
                        className={twMerge(
                          "w-4 h-4 text-white/70 transition-all duration-300 ease-out",
                          "group-hover/item:text-primary",
                          isOpen && "transform rotate-180 text-primary",
                        )}
                      />
                    </div>
                  </button>
                  {/* Divider line */}
                  <div
                    className={twMerge(
                      "relative z-10 mx-8 h-px",
                      "bg-linear-to-r from-transparent via-white/20 to-transparent",
                      "opacity-0 transition-opacity duration-300 ease-out",
                      isOpen && "opacity-100",
                    )}
                    aria-hidden="true"
                  />

                  <div
                    id={`accordion-details-${itemIndex}`}
                    ref={(el) => {
                      detailsRefs.current[itemIndex] = el;
                    }}
                    className={twMerge(
                      "relative z-10 overflow-hidden",
                      "text-white/80 text-[15px] leading-relaxed",
                      "transition-all duration-300 ease-out",
                    )}
                    style={{ maxHeight: 0 }}
                  >
                    <div className="px-8 pb-6 pt-4">{item.details}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render simple accordion
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={twMerge("flex flex-col gap-4 w-full", className)}>
      {/* Accordion items */}
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className={twMerge(
              "group/item relative overflow-hidden rounded-3xl",
              "bg-linear-to-br from-white/5 via-white/3 to-white/5",
              "backdrop-blur-sm border border-white/10",
              "transition-all duration-300 ease-out",
              "hover:bg-white/10 hover:border-primary/40",
              "hover:shadow-xl hover:shadow-primary/25",
            )}
          >
            {/* Background gradient overlay */}
            <div
              className={twMerge(
                "absolute inset-0 rounded-3xl",
                "bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
                "opacity-0 transition-opacity duration-300 ease-out",
                "group-hover/item:opacity-100",
                isOpen && "opacity-100",
              )}
              aria-hidden="true"
            />

            {/* Decorative corner accent */}
            <div
              className={twMerge(
                "absolute bottom-0 right-0 w-24 h-24",
                "bg-linear-to-tr from-primary/15 to-transparent",
                "rounded-tl-full",
                "transition-all duration-300 ease-out",
                "group-hover/item:w-28 group-hover/item:h-28 group-hover/item:from-primary/20",
                isOpen && "w-28 h-28 from-primary/20",
              )}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => toggleItem(index)}
              className={twMerge(
                "relative z-10 w-full flex items-center justify-between",
                "py-5 px-8 text-left",
                "transition-all duration-300 ease-out",
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-details-${index}`}
            >
              <span
                className={twMerge(
                  "font-medium text-white/90 text-[16px] pr-4",
                  "leading-snug",
                  "transition-colors duration-300 ease-out",
                  "group-hover/item:text-white",
                  isOpen && "text-white",
                )}
              >
                {item.summary}
              </span>
              <div
                className={twMerge(
                  "relative shrink-0",
                  "w-8 h-8 rounded-full",
                  "bg-white/10 border border-white/20",
                  "flex items-center justify-center",
                  "transition-all duration-300 ease-out",
                  "group-hover/item:bg-primary/20 group-hover/item:border-primary/40",
                  "group-hover/item:scale-110",
                  isOpen && "bg-primary/20 border-primary/40 scale-110",
                )}
                aria-hidden="true"
              >
                <ChevronDown
                  className={twMerge(
                    "w-4 h-4 text-white/70 transition-all duration-300 ease-out",
                    "group-hover/item:text-primary",
                    isOpen && "transform rotate-180 text-primary",
                  )}
                />
              </div>
            </button>

            {/* Divider line */}
            <div
              className={twMerge(
                "relative z-10 mx-8 h-px",
                "bg-linear-to-r from-transparent via-white/20 to-transparent",
                "opacity-0 transition-opacity duration-300 ease-out",
                isOpen && "opacity-100",
              )}
              aria-hidden="true"
            />

            <div
              id={`accordion-details-${index}`}
              ref={(el) => {
                detailsRefs.current[index] = el;
              }}
              className={twMerge(
                "relative z-10 overflow-hidden",
                "text-white/80 text-[15px] leading-relaxed",
                "transition-all duration-300 ease-out",
              )}
              style={{ maxHeight: 0 }}
            >
              {/* Details */}
              <div className="px-8 pb-6 pt-4">{item.details}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionClient;
