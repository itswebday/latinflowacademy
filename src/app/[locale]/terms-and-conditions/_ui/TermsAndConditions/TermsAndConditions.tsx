import RichTextRenderer from "@/components/RichTextRenderer";
import type { RichText } from "@/types";

type TermsAndConditionsProps = {
  content: RichText;
};

const TermsAndConditions = ({ content }: TermsAndConditionsProps) => {
  return (
    <section className="w-11/12 max-w-7xl py-32 mx-auto">
      <RichTextRenderer richText={content} />
    </section>
  );
};

export default TermsAndConditions;
