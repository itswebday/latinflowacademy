import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getButtonLinkFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";

export const TextBlock: Block = {
  slug: "text-block",
  labels: {
    singular: "Text",
    plural: "Text blocks",
  },
  interfaceName: "TextBlock",
  fields: [
    ...getHeadingFields({
      fieldName: "subheading",
      fieldLabel: "Subheading",
      optional: true,
    }),
    ...getHeadingFields({
      fieldName: "heading",
      fieldLabel: "Heading",
      optional: true,
    }),
    {
      name: "text",
      label: "Text",
      type: "group",
      required: true,
      fields: [RichTextField({ required: true })],
    },
    ...getButtonLinkFields({ optional: true }),
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "width",
      label: "Width",
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
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
