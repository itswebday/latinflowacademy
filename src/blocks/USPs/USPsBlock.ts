import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const USPsBlock: Block = {
  slug: "usps-block",
  labels: {
    singular: "USPs",
    plural: "USPs blocks",
  },
  interfaceName: "USPsBlock",
  fields: [
    {
      name: "usps",
      label: "USPs",
      type: "array",
      minRows: 4,
      maxRows: 4,
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
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
      ],
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
