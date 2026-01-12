import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";

type PriceCardDescriptionProps = {
  description: Config["globals"]["prices"]["memberships"][number]["description"];
};

const PriceCardDescription: React.FC<PriceCardDescriptionProps> = async ({
  description,
}) => {
  return <RichTextRenderer richText={description} />;
};

export default PriceCardDescription;
