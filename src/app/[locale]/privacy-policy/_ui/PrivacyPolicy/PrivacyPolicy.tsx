import RichTextRenderer from "@/components/RichTextRenderer";
import type { RichText } from "@/types";

type PrivacyPolicyProps = {
  content: RichText;
};

const PrivacyPolicy = ({ content }: PrivacyPolicyProps) => {
  return (
    <section className="w-11/12 max-w-7xl py-32 mx-auto">
      <RichTextRenderer richText={content} />
    </section>
  );
};

export default PrivacyPolicy;
