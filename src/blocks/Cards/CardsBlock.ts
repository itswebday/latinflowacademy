import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getButtonLinkFields,
  getPaddingFields,
} from "@/utils";

export const CardsBlock: Block = {
  slug: "cards-block",
  labels: {
    singular: "Cards",
    plural: "Cards blocks",
  },
  interfaceName: "CardsBlock",
  fields: [
    {
      name: "cards",
      label: "Cards",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      fields: [
        {
          name: "image",
          label: "Image (optional)",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "title",
          label: "Title",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        RichTextField({
          name: "description",
          label: "Description",
          required: true,
        }),
        {
          name: "leftLabel",
          label: "Left Label (optional)",
          type: "text",
          defaultValue: "",
          localized: true,
          required: false,
        },
        {
          name: "rightLabel",
          label: "Right Label (optional)",
          type: "text",
          defaultValue: "",
          localized: true,
          required: false,
        },
        ...getButtonLinkFields({ optional: true }),
        {
          name: "style",
          label: "Style",
          type: "group",
          required: true,
          fields: [
            {
              name: "color",
              label: "Color",
              type: "select",
              defaultValue: "primary",
              required: true,
              options: [
                {
                  label: "Primary",
                  value: "primary",
                },
                {
                  label: "Blue",
                  value: "blue",
                },
                {
                  label: "Green",
                  value: "green",
                },
                {
                  label: "Red",
                  value: "red",
                },
                {
                  label: "Orange",
                  value: "orange",
                },
                {
                  label: "Yellow",
                  value: "yellow",
                },
              ],
            },
          ],
        },
      ],
    },
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
