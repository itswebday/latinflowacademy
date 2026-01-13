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
        className="justify-center text-center"
        icon={heading.icon}
      >
        <h2 className="font-bold text-dark">
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
        "w-full overflow-hidden",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 mx-auto">
        {/* Heading */}
        {headingElement && (
          <AnimatedWrapper delay={0} direction="up">
            <header className="mb-8">{headingElement}</header>
          </AnimatedWrapper>
        )}

        {/* Accordion Content */}
        <AnimatedWrapper delay={0.1} direction="up">
          {categorize ? renderCategorizedAccordion() : renderSimpleAccordion()}
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default Accordion;
