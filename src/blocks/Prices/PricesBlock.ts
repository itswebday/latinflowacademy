import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const PricesBlock: Block = {
  slug: "prices-block",
  labels: {
    singular: "Prices",
    plural: "Prices blocks",
  },
  interfaceName: "PricesBlock",
  fields: [
    {
      name: "categories",
      label: "Price categories",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "name",
          label: "Category name",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "prices",
          label: "Prices",
          type: "array",
          required: true,
          minRows: 1,
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "title",
              label: "Product title (for example: '3 classes')",
              type: "text",
              defaultValue: "",
              localized: true,
              required: true,
            },
            {
              name: "subtitle",
              label: "Optional duration (for example: 'weekly')",
              type: "text",
              defaultValue: "",
              localized: true,
              required: false,
            },
            RichTextField({
              name: "price",
              label: "Price (for example: '€100/month')",
              required: true,
            }),
            RichTextField({
              name: "description",
              label: "Description",
              required: true,
            }),
            {
              name: "url",
              label: "Link (URL) to buy the product",
              type: "text",
              defaultValue: "",
              required: false,
            },
          ],
        },
      ],
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
