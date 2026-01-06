import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";

export const CallToActionBlock: Block = {
  slug: "call-to-action-block",
  labels: {
    singular: "Call-To-Action",
    plural: "Call-To-Action blocks",
  },
  interfaceName: "CallToActionBlock",
  fields: [
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    ...getHeadingFields({
      fieldName: "heading",
      fieldLabel: "Heading",
      hiddenFields: ["icon"],
      optional: true,
    }),
    RichTextField({ name: "text", label: "Text", required: true }),
    ...getButtonLinkFields(),
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
