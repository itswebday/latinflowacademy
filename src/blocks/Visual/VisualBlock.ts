import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
  getSocialMediaFields,
} from "@/utils";

export const VisualBlock: Block = {
  slug: "visual-block",
  labels: {
    singular: "Visual",
    plural: "Visual blocks",
  },
  interfaceName: "VisualBlock",
  fields: [
    {
      name: "visual",
      label: "Image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "visualMobile",
      label: "Image for mobile (optional)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "height",
      label: "Height",
      type: "select",
      options: [
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
    },
    {
      name: "opacity",
      label: "Opacity",
      type: "number",
      min: 0,
      max: 100,
      defaultValue: 100,
      required: true,
    },
    ...getHeadingFields({ hiddenFields: ["icon"], optional: true }),
    ...getButtonLinkFields({ optional: true }),
    ...getSocialMediaFields({ optional: true }),
    ...getBlockSettingsFields(),
  ],
};
