import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import { processText } from "@/utils";
import type { Config } from "@/payload-types";
import MembershipsSection from "../MembershipsSection/MembershipsSection";
import PunchCardsSection from "../PunchCardsSection/PunchCardsSection";
import PricesTabs from "../PricesTabs/PricesTabs";

type PricesProps = {
  prices: Config["globals"]["prices"];
};

const Prices: React.FC<PricesProps> = async ({ prices }) => {
  return (
    <section className="relative flex justify-center w-full pt-40 pb-20 bg-dark">
      {/* Container */}
      <div
        className={twMerge(
          "relative z-10 flex flex-col items-center gap-6",
          "w-11/12 max-w-7xl mx-auto",
        )}
      >
        {/* Heading */}
        <AnimatedWrapper delay={0} direction="up">
          <div className="relative w-full pb-4">
            <HeadingWithIcon
              icon={prices.heading.icon}
              className="justify-center text-center"
            >
              <h1
                className={twMerge(
                  "relative font-bold text-center",
                  "text-[48px] de:text-[64px]",
                  "leading-tight tracking-tight",
                  "bg-linear-to-r from-primary via-secondary to-primary",
                  "bg-clip-text text-transparent",
                  "bg-size-[200%_auto]",
                  "animate-[gradient_3s_ease_infinite]",
                  "drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]",
                  "drop-shadow-[0_0_60px_rgba(162,54,219,0.3)]",
                )}
              >
                {processText(prices.heading.text)}
              </h1>
            </HeadingWithIcon>

            {/* Stripe below */}
            <div
              className={twMerge(
                "absolute bottom-0 left-1/2 -translate-x-1/2",
                "w-32 h-1 rounded-full",
                "bg-linear-to-r from-transparent via-primary to-transparent",
                "opacity-60",
              )}
              aria-hidden="true"
            />
          </div>
        </AnimatedWrapper>

        {/* Paragraph */}
        <AnimatedWrapper delay={0.1} direction="up">
          <div
            className={twMerge(
              "max-w-3xl mx-auto text-center",
              "text-white/90",
              "leading-relaxed tracking-wide",
              "px-4 mb-12",
            )}
          >
            <RichTextRenderer richText={prices.paragraph.text} />
          </div>
        </AnimatedWrapper>

        {/* Tabs */}
        <AnimatedWrapper delay={0.2} direction="up" className="w-full">
          <PricesTabs
            tabs={[
              ...((
                prices as {
                  punchCardsHeading?: {
                    text?: string;
                    icon?:
                      | number
                      | { id?: number | null; url?: string | null }
                      | null;
                  };
                }
              ).punchCardsHeading?.text && (prices.punchCards || []).length > 0
                ? [
                    {
                      id: "punchCards",
                      label:
                        (
                          prices as {
                            punchCardsHeading?: { text?: string };
                          }
                        ).punchCardsHeading?.text || "",
                      icon: (
                        prices as {
                          punchCardsHeading?: {
                            icon?:
                              | number
                              | { id?: number | null; url?: string | null }
                              | null;
                          };
                        }
                      ).punchCardsHeading?.icon,
                      content: <PunchCardsSection prices={prices} />,
                    },
                  ]
                : []),
              ...((
                prices as {
                  membershipsHeading?: {
                    text?: string;
                    icon?:
                      | number
                      | { id?: number | null; url?: string | null }
                      | null;
                  };
                }
              ).membershipsHeading?.text &&
              (prices.memberships || []).length > 0
                ? [
                    {
                      id: "memberships",
                      label:
                        (
                          prices as {
                            membershipsHeading?: { text?: string };
                          }
                        ).membershipsHeading?.text || "",
                      icon: (
                        prices as {
                          membershipsHeading?: {
                            icon?:
                              | number
                              | { id?: number | null; url?: string | null }
                              | null;
                          };
                        }
                      ).membershipsHeading?.icon,
                      content: <MembershipsSection prices={prices} />,
                    },
                  ]
                : []),
            ]}
            defaultTab={
              (prices.punchCards || []).length > 0
                ? "punchCards"
                : (prices.memberships || []).length > 0
                  ? "memberships"
                  : undefined
            }
          />
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default Prices;
