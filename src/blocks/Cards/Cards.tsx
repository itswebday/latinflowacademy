import React from "react";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
  ButtonLink,
  type ButtonLinkProps,
  Card,
} from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { CardsBlock } from "@/payload-types";
import type { Globals, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses, getUrl } from "@/utils";

const Cards: React.FC<CardsBlock & { id?: string; globals: Globals }> = ({
  cards,
  paddingTop,
  paddingBottom,
  hidden,
  id,
  globals,
}) => {
  if (!cards || cards.length === 0) {
    return null;
  }

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
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 de:grid-cols-2 xl:grid-cols-3 gap-6 de:gap-12 items-stretch">
          {cards.map((card, index) => {
            const { url: imageUrl, alt: imageAlt } = card.image
              ? getMediaUrlAndAlt(card.image)
              : { url: undefined, alt: undefined };

            const buttonUrl = card.showButton
              ? getUrl(card.button as RawUrl, globals)
              : undefined;

            return (
              <AnimatedWrapper
                key={index}
                delay={index * 0.1}
                direction="up"
                className="h-full"
              >
                <Card
                  imageUrl={imageUrl}
                  imageAlt={imageAlt}
                  title={card.title}
                  description={<RichTextRenderer richText={card.description} />}
                  leftLabel={card.leftLabel}
                  rightLabel={card.rightLabel}
                  className="h-full"
                >
                  {card.showButton && card.button && buttonUrl && (
                    <div className="mt-4">
                      <ButtonLink
                        variant={
                          (card.button as { variant?: string })
                            .variant as ButtonLinkProps["variant"]
                        }
                        href={buttonUrl}
                        target={
                          (card.button as { newTab?: boolean }).newTab
                            ? "_blank"
                            : "_self"
                        }
                      >
                        {(card.button as { text?: string }).text}
                      </ButtonLink>
                    </div>
                  )}
                </Card>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Cards;
