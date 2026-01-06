import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const AccordionBlock: Block = {
  slug: "accordion-block",
  labels: {
    singular: "Accordion",
    plural: "Accordion blocks",
  },
  interfaceName: "AccordionBlock",
  fields: [
    {
      name: "tabs",
      label: "Categories",
      type: "array",
      required: false,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "items",
      label: "FAQs",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "tab",
          label: "Category",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "summary",
          label: "Summary",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "details",
          label: "Details",
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
