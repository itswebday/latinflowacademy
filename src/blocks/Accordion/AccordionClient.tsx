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
      <div className={twMerge("flex flex-col gap-6", className)}>
        {/* Category Tabs */}
        <SwiperContainer
          spaceBetween={12}
          className="-mx-6 px-6"
          slideClassName="!w-auto"
        >
          {categories.map((category, categoryIndex: number) => {
            const isActive = activeCategoryIndex === categoryIndex;
            return (
              <button
                key={categoryIndex}
                type="button"
                onClick={() => setActiveCategoryIndex(categoryIndex)}
                className={twMerge(
                  "px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap",
                  "transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-light text-dark hover:bg-dark/5",
                )}
              >
                {category.name}
              </button>
            );
          })}
        </SwiperContainer>

        {/* Active Category Items */}
        {activeCategory && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-dark">
              {activeCategory.name}
            </h3>
            <div className="flex flex-col">
              {activeCategory.items.map((item, itemIndex) => {
                const isOpen = activeIndex === itemIndex;
                return (
                  <div
                    key={itemIndex}
                    className="border-b border-dark/10 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(itemIndex)}
                      className={twMerge(
                        "w-full flex items-center justify-between py-4 px-0 text-left",
                        "transition-colors duration-200",
                        "hover:text-primary",
                      )}
                      aria-expanded={isOpen}
                      aria-controls={`accordion-details-${itemIndex}`}
                    >
                      <span className="font-semibold text-dark pr-4">
                        {item.summary}
                      </span>
                      <ChevronDown
                        className={twMerge(
                          "w-5 h-5 text-dark transition-transform duration-200 shrink-0",
                          isOpen && "transform rotate-180",
                        )}
                      />
                    </button>
                    <div
                      id={`accordion-details-${itemIndex}`}
                      ref={(el) => {
                        detailsRefs.current[itemIndex] = el;
                      }}
                      className="text-dark/90 overflow-hidden transition-all duration-200"
                      style={{ maxHeight: 0 }}
                    >
                      <div className="pb-4">{item.details}</div>
                    </div>
                  </div>
                );
              })}
            </div>
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
    <div className={twMerge("flex flex-col", className)}>
      {/* Accordion items */}
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div key={index} className="border-b border-dark/10 last:border-b-0">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className={twMerge(
                "w-full flex items-center justify-between py-4 px-0 text-left",
                "transition-colors duration-200",
                "hover:text-primary",
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-details-${index}`}
            >
              <span className="font-semibold text-dark pr-4">
                {item.summary}
              </span>
              <ChevronDown
                className={twMerge(
                  "w-5 h-5 text-dark transition-transform duration-200 shrink-0",
                  isOpen && "transform rotate-180",
                )}
              />
            </button>
            <div
              id={`accordion-details-${index}`}
              ref={(el) => {
                detailsRefs.current[index] = el;
              }}
              className="text-dark/90 overflow-hidden transition-all duration-200"
              style={{ maxHeight: 0 }}
            >
              {/* Details */}
              <div className="pb-4">{item.details}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionClient;
