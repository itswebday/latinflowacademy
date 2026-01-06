import React from "react";
import { twMerge } from "tailwind-merge";
import { getTranslations } from "next-intl/server";
import { ButtonLink, SwiperContainer, Tabs } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { PricesBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getPaddingClasses } from "@/utils";

const Prices: React.FC<
  PricesBlock & { id?: string; globals: Globals }
> = async ({
  categories,
  background,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  const blocksT = await getTranslations("blocks");

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "flex flex-col items-center gap-20 overflow-hidden",
        background === "white" && "bg-white",
        background === "light" && "bg-light",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-5/6 de:w-full">
        {/* Tabs with prices */}
        <Tabs
          className="w-full"
          tabsClassName="de:w-1/3 xl:w-1/4"
          tabsOnTheSide={true}
          dropdownTabsMobile={true}
          tabs={categories.map((category) => ({
            label: category.name || "",
            children: (
              <SwiperContainer
                className="de:w-2/3 de:mx-4 de:my-auto xl:w-3/4"
                spaceBetween={20}
              >
                {category.prices?.map((price, index) => (
                  <div
                    key={index}
                    className={twMerge(
                      "relative flex flex-col items-center gap-6",
                      "w-price h-auto py-6 pb-0",
                      "border border-gray/30 rounded-sm",
                    )}
                  >
                    {/* Heading */}
                    <header className="flex flex-col items-center text-gray">
                      {/* Title */}
                      {price.title && <h3>{price.title}</h3>}

                      {/* Subtitle */}
                      {price.subtitle && (
                        <p className="text-[15px]">{price.subtitle}</p>
                      )}
                    </header>

                    {/* Price */}
                    <RichTextRenderer
                      className={twMerge(
                        "flex justify-center items-center w-full py-6",
                        "text-[32px] text-white font-normal bg-primary",
                      )}
                      richText={price.price as RichText}
                    />

                    {/* Description */}
                    <RichTextRenderer
                      className={twMerge(
                        "px-4 mb-24 translate-x-2",
                        "text-[15px] leading-8",
                      )}
                      richText={price.description as RichText}
                    />

                    {/* Button */}
                    {price.url && (
                      <div className="absolute bottom-6 mx-auto">
                        <ButtonLink
                          variant="primaryButton"
                          href={price.url}
                          target="_blank"
                        >
                          {blocksT("prices.buyButton")}
                        </ButtonLink>
                      </div>
                    )}
                  </div>
                ))}
              </SwiperContainer>
            ),
          }))}
        />
      </div>
    </section>
  );
};

export default Prices;
