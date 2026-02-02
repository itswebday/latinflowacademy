import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
  getSocialMediaFields,
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
      name: "visual",
      label: "Image (optional)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "visualMobile",
      label: "Image for mobile (optional)",
      type: "upload",
      relationTo: "media",
    },
    ...getHeadingFields({ optional: true }),
    RichTextField({ required: true }),
    ...getButtonLinkFields(),
    ...getButtonLinkFields({
      fieldName: "button2",
      fieldLabel: "Second button",
      optional: true,
    }),
    ...getSocialMediaFields({ optional: true }),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
