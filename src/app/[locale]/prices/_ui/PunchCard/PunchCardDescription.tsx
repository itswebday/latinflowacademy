import RichTextRenderer from "@/components/RichTextRenderer";
import type { Config } from "@/payload-types";

type PunchCardDescriptionProps = {
  description: NonNullable<
    NonNullable<Config["globals"]["prices"]>["punchCards"]
  >[number]["description"];
};

const PunchCardDescription: React.FC<PunchCardDescriptionProps> = async ({
  description,
}) => {
  return <RichTextRenderer richText={description} />;
};

export default PunchCardDescription;
