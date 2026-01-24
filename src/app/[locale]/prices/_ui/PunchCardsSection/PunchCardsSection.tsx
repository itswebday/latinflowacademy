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
      {/* Punch Cards Grid */}
      <div
        className={twMerge(
          "grid grid-cols-1 de:grid-cols-2 xl:grid-cols-3 gap-8 de:gap-12 items-stretch",
          "w-full",
        )}
      >
        {punchCardsWithDescriptions.map(({ punchCard, description, index }) => (
          <PunchCard
            key={index}
            punchCard={punchCard}
            description={description}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PunchCardsSection;
