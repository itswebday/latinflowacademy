import React from "react";
import { twMerge } from "tailwind-merge";
import { Tabs } from "@/components";
import type { AccordionBlock } from "@/payload-types";
import type { Globals } from "@/types";
import { getPaddingClasses } from "@/utils";
import AccordionClient from "./AccordionClient";

const Accordion: React.FC<
  AccordionBlock & { id?: string; globals: Globals }
> = (props) => {
  const { tabs, items, background, paddingTop, paddingBottom, hidden, id } =
    props as AccordionBlock & {
      id?: string;
      globals: Globals;
      tabs?: Array<{ name?: string | null }> | null;
    };
  if (!items || items.length === 0) {
    return null;
  }

  const hasTabs = tabs && Array.isArray(tabs) && tabs.length > 0;

  if (hasTabs) {
    const tabItems = (tabs as Array<{ name?: string | null }>).map(
      (tab, index) => {
        const tabItems = (
          items as Array<{
            tab?: string | null;
            summary?: string | null;
            details?: string | null;
          }>
        ).filter((item) => item.tab === tab.name);

        return {
          label: tab.name || "",
          children: (
            <AccordionClient
              key={tab.name || `tab-${index}`}
              className="mt-8"
              items={tabItems.map((item) => ({
                summary: item.summary || "",
                details: item.details || "",
              }))}
            />
          ),
        };
      },
    );

    return (
      <section
        id={id}
        className={twMerge(
          "flex flex-col items-center gap-12 w-full",
          background === "white" && "bg-white",
          background === "light" && "bg-light",
          getPaddingClasses(paddingTop, paddingBottom),
          hidden && "hidden",
        )}
      >
        {/* Container */}
        <div className="w-11/12 max-w-7xl de:w-5/6 mx-auto">
          <Tabs tabs={tabItems} />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={twMerge(
        "flex flex-col items-center gap-12 w-full",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl de:w-5/6 mx-auto">
        <AccordionClient
          items={(
            items as Array<{
              summary?: string | null;
              details?: string | null;
            }>
          ).map((item) => ({
            summary: item.summary || "",
            details: item.details || "",
          }))}
        />
      </div>
    </section>
  );
};

export default Accordion;
