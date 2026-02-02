import { twMerge } from "tailwind-merge";
import type { Config } from "@/payload-types";
import PriceCard from "../PriceCard/PriceCard";
import PriceCardDescription from "../PriceCard/PriceCardDescription";

type MembershipsSectionProps = {
  prices: Config["globals"]["prices"];
};

const MembershipsSection: React.FC<MembershipsSectionProps> = async ({
  prices,
}) => {
  const memberships = prices.memberships || [];

  if (memberships.length === 0) {
    return null;
  }

  const membershipsWithDescriptions = await Promise.all(
    memberships.map(async (membership, index) => {
      const description = await PriceCardDescription({
        description: membership.description,
      });

      return {
        membership,
        description,
        index,
      };
    }),
  );

  return (
    <div className="w-full">
      {/* Memberships Grid - flex so fewer items center */}
      <div className="flex flex-wrap justify-center gap-8 de:gap-12">
        {membershipsWithDescriptions.map(
          ({ membership, description, index }) => (
            <div
              key={index}
              className={twMerge(
                "w-full de:w-[calc(50%-1.5rem)] xl:w-[320px]",
                "h-full shrink-0",
              )}
            >
              <PriceCard
                title={membership.title || ""}
                priceLabel={membership.priceLabel ?? undefined}
                price={membership.price || ""}
                description={description}
                discount={membership.discount ?? undefined}
                newPrice={membership.newPrice || undefined}
                details={
                  membership.details?.map((d) => ({
                    detail: d.detail || "",
                  })) || []
                }
                button={membership.button!}
                options={membership.options || []}
                style={{
                  color: membership.style?.color || "primary",
                  mostPopular: membership.style?.mostPopular ?? false,
                }}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default MembershipsSection;
