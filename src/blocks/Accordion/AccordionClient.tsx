"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type AccordionClientProps = {
  className?: string;
  items: {
    summary: React.ReactNode;
    details: React.ReactNode;
  }[];
};

const AccordionClient: React.FC<AccordionClientProps> = ({
  className,
  items,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {/* Accordion items */}
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray/30">
          <button
            className={twMerge(
              "flex justify-between items-center gap-4 w-full p-6 text-left",
              "bg-light",
            )}
            aria-controls={`accordion-details-${index}`}
            aria-expanded={activeIndex === index}
            onClick={() => toggleItem(index)}
          >
            {/* Summary */}
            <p className="uppercase">{item.summary}</p>

            {/* Icon */}
            <span
              className={twMerge(
                "relative shrink-0 w-4 h-4 transition-transform duration-200",
                activeIndex === index && "rotate-180",
              )}
            >
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </span>
          </button>
          <div
            id={`accordion-details-${index}`}
            ref={(el) => {
              detailsRefs.current[index] = el;
            }}
            className="text-left overflow-hidden transition-all duration-200"
            style={{ maxHeight: 0 }}
          >
            {/* Details */}
            <p className="p-6">{item.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionClient;
