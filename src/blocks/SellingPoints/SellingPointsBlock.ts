import type { Block } from "payload";
import { getBlockSettingsFields, getPaddingFields } from "@/utils";

export const SellingPointsBlock: Block = {
  slug: "selling-points-block",
  labels: {
    singular: "Selling Points",
    plural: "Selling Points blocks",
  },
  interfaceName: "SellingPointsBlock",
  fields: [
    {
      name: "sellingPoints",
      label: "Selling Points",
      type: "array",
      minRows: 1,
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "icon",
          label: "Icon",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "text",
          label: "Text",
          type: "textarea",
          defaultValue: "",
          localized: true,
          required: true,
        },
      ],
    },
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
