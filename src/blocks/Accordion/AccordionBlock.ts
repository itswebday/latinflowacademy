import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getHeadingFields,
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
    ...getHeadingFields({
      fieldName: "heading",
      fieldLabel: "Heading",
      optional: true,
    }),
    {
      name: "categorize",
      label: "Categorize",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "categories",
      label: "Categories",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      labels: {
        singular: "Category",
        plural: "Categories",
      },
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.categorize === true;
        },
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
        {
          name: "items",
          label: "Items",
          type: "array",
          defaultValue: [],
          minRows: 1,
          required: true,
          labels: {
            singular: "Item",
            plural: "Items",
          },
          fields: [
            {
              name: "summary",
              label: "Summary",
              type: "text",
              defaultValue: "",
              localized: true,
              required: true,
            },
            RichTextField({
              name: "details",
              label: "Details",
              required: true,
            }),
          ],
        },
      ],
    },
    {
      name: "items",
      label: "Items",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      labels: {
        singular: "Item",
        plural: "Items",
      },
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.categorize !== true;
        },
      },
      fields: [
        {
          name: "summary",
          label: "Summary",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        RichTextField({
          name: "details",
          label: "Details",
          required: true,
        }),
      ],
    },
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
