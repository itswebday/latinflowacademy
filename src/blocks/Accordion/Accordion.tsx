import React from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import AccordionClient from "./AccordionClient";
import type { AccordionBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getPaddingClasses, processText } from "@/utils";

const Accordion: React.FC<
  AccordionBlock & { id?: string; globals: Globals }
> = ({
  showHeading,
  heading,
  categorize,
  categories,
  items,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  // Heading
  const headingElement =
    showHeading && heading ? (
      <HeadingWithIcon
        className={twMerge(
          "justify-center text-center",
          "de:justify-start de:text-left",
        )}
        icon={heading.icon}
      >
        <h2
          className={twMerge(
            "relative font-bold",
            "text-[32px] de:text-[40px]",
            "leading-tight tracking-tight",
            "bg-linear-to-r from-primary via-secondary to-primary",
            "bg-clip-text text-transparent",
            "bg-size-[200%_auto]",
            "animate-[gradient_3s_ease_infinite]",
            "drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]",
            "drop-shadow-[0_0_40px_rgba(162,54,219,0.2)]",
          )}
        >
          {typeof heading.text === "string"
            ? processText(heading.text)
            : heading.text}
        </h2>
      </HeadingWithIcon>
    ) : null;

  // Render categorized accordion
  const renderCategorizedAccordion = () => {
    if (!categories) {
      return null;
    }

    // Pre-render all category content server-side
    const categoryContent = categories.map((category) => ({
      name: category.name,
      items: category.items.map((item) => ({
        summary: item.summary,
        details: <RichTextRenderer richText={item.details as RichText} />,
      })),
    }));

    return <AccordionClient categorize={true} categories={categoryContent} />;
  };

  // Render simple accordion
  const renderSimpleAccordion = () => {
    if (!items) {
      return null;
    }

    // Pre-render items server-side
    const accordionItems = items.map((item) => ({
      summary: item.summary,
      details: <RichTextRenderer richText={item.details as RichText} />,
    }));

    return <AccordionClient categorize={false} items={accordionItems} />;
  };

  return (
    <section
      id={id}
      className={twMerge(
        "relative w-full overflow-hidden bg-dark",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="relative z-10 w-11/12 max-w-5xl mx-auto">
        {/* Heading and Accordion Content */}
        <div
          className={twMerge(
            "flex flex-col gap-8 w-full",
            "de:flex-row de:items-start de:gap-12",
          )}
        >
          {/* Heading */}
          {showHeading && heading && headingElement && (
            <AnimatedWrapper delay={0} direction="up">
              <header
                className={twMerge("mb-8 w-full shrink-0", "de:mb-0 de:w-72")}
              >
                {headingElement}
              </header>
            </AnimatedWrapper>
          )}

          {/* Accordion Content */}
          <AnimatedWrapper
            delay={0.1}
            direction="up"
            className={headingElement ? "de:flex-1 de:min-w-0" : undefined}
          >
            <div className="w-full">
              {categorize
                ? renderCategorizedAccordion()
                : renderSimpleAccordion()}
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
};

export default Accordion;
