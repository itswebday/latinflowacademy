import React from "react";
import { twMerge } from "tailwind-merge";
import { HeadingWithIcon, Tabs } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { StudioRentalBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getPaddingClasses, highlightText } from "@/utils";

const StudioRental: React.FC<
  StudioRentalBlock & { id?: string; globals: Globals }
> = (props) => {
  const { studios, background, paddingTop, paddingBottom, hidden, id } =
    props as StudioRentalBlock & {
      id?: string;
      globals: Globals;
      studios?: Array<{
        name?: string | null;
        iframe?: string | null;
      }> | null;
    };

  if (!studios || studios.length === 0) {
    return null;
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
      {/* Studios */}
      <div className="flex justify-center w-full">
        <Tabs
          className="w-11/12 max-w-7xl de:w-5/6"
          tabs={(
            studios as Array<{
              name?: string | null;
              description?: RichText | null;
              iframeUrl?: string | null;
            }>
          ).map((studio, index) => ({
            label: studio.name || "",
            children: (
              <div
                key={studio.name || `studio-${index}`}
                className="flex flex-col items-center gap-2"
              >
                {/* Description */}
                {studio.description && (
                  <RichTextRenderer
                    className="px-4 py-6 mr-auto"
                    richText={studio.description}
                  />
                )}

                {/* iFrame */}
                {studio.iframeUrl && (
                  <iframe
                    className="w-full h-[700px] rounded-lg"
                    src={studio.iframeUrl}
                  />
                )}
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
};

export default StudioRental;
