import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";
import MembershipsSection from "../MembershipsSection/MembershipsSection";
import PunchCardsSection from "../PunchCardsSection/PunchCardsSection";

type PricesProps = {
  prices: Config["globals"]["prices"];
};

const Prices: React.FC<PricesProps> = async ({ prices }) => {
  return (
    <section className="relative flex justify-center w-full py-32 bg-dark">
      {/* Container */}
      <div
        className={twMerge(
          "relative z-10 flex flex-col items-center gap-8",
          "w-11/12 max-w-7xl mx-auto",
          "de:gap-12",
        )}
      >
        {/* Heading */}
        <AnimatedWrapper delay={0} direction="up">
          <HeadingWithIcon icon={prices.heading.icon}>
            <h1 className="font-bold text-white text-center">
              {prices.heading.text}
            </h1>
          </HeadingWithIcon>
        </AnimatedWrapper>

        {/* Paragraph */}
        <AnimatedWrapper delay={0.1} direction="up">
          <div className="max-w-2xl mx-auto text-white/80 text-center text-[16px]">
            <RichTextRenderer richText={prices.paragraph.text} />
          </div>
        </AnimatedWrapper>

        {/* Punch Cards Section */}
        <PunchCardsSection prices={prices} />

        {/* Memberships Section */}
        <MembershipsSection prices={prices} />
      </div>
    </section>
  );
};

export default Prices;
