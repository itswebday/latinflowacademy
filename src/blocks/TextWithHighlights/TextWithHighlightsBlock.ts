import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";

export const TextWithHighlightsBlock: Block = {
  slug: "text-with-hl-block",
  labels: {
    singular: "Text with Highlights",
    plural: "Text with Highlights blocks",
  },
  interfaceName: "TextWithHighlightsBlock",
  fields: [
    ...getHeadingFields({
      fieldName: "subheading",
      fieldLabel: "Subheading",
      hiddenFields: ["icon"],
      optional: true,
    }),
    ...getHeadingFields({
      fieldName: "heading",
      fieldLabel: "Heading",
      hiddenFields: ["icon"],
      optional: true,
    }),
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
      required: true,
    },
    {
      name: "hlTexts",
      label: "",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Highlighted text",
        plural: "Highlighted texts",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "text",
          label: "Text",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
