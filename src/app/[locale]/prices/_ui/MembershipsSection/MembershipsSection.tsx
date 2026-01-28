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
      {/* Memberships Grid */}
      <div
        className={twMerge(
          "grid grid-cols-1 de:grid-cols-2 xl:grid-cols-3 gap-8 de:gap-12 items-stretch",
          "w-full",
        )}
      >
        {membershipsWithDescriptions.map(
          ({ membership, description, index }) => (
            <div key={index} className="h-full">
              <PriceCard
                title={membership.title || ""}
                subtitle={membership.subtitle || undefined}
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
