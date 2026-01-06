import type { Block } from "payload";
import { getBlockSettingsFields, getHeadingFields } from "@/utils";

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
      label: "Video or image",
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
    ...getBlockSettingsFields(),
  ],
};
