import { twMerge } from "tailwind-merge";
import type { Config } from "@/payload-types";
import PunchCard from "../PunchCard/PunchCard";
import PunchCardDescription from "../PunchCard/PunchCardDescription";

type PunchCardsSectionProps = {
  prices: Config["globals"]["prices"];
};

const PunchCardsSection: React.FC<PunchCardsSectionProps> = async ({
  prices,
}) => {
  const punchCards = prices.punchCards || [];

  if (punchCards.length === 0) {
    return null;
  }

  const punchCardsWithDescriptions = await Promise.all(
    punchCards.map(async (punchCard, index) => {
      const description = await PunchCardDescription({
        description: punchCard.description,
      });

      return {
        punchCard,
        description,
        index,
      };
    }),
  );

  return (
    <div className="w-full">
      {/* Punch Cards Grid - flex so fewer items center; items-stretch for equal row height */}
      <div className="flex flex-wrap justify-center items-stretch gap-8 de:gap-12">
        {punchCardsWithDescriptions.map(({ punchCard, description, index }) => (
          <div
            key={index}
            className={twMerge(
              "w-full de:w-[calc(50%-1.5rem)] xl:w-[355px]",
              "flex flex-col shrink-0 min-h-0",
            )}
          >
            <PunchCard
              punchCard={punchCard}
              description={description}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PunchCardsSection;
