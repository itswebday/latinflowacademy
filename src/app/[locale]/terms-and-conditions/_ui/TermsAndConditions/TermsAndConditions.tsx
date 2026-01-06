import RichTextRenderer from "@/components/RichTextRenderer";
import type { RichText } from "@/types";

type TermsAndConditionsProps = {
  content: RichText;
};

const TermsAndConditions = ({ content }: TermsAndConditionsProps) => {
  return (
    <section className="w-11/12 max-w-7xl py-12 mx-auto de:py-20">
      <RichTextRenderer richText={content} />
    </section>
  );
};

export default TermsAndConditions;
