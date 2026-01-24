import type { Block } from "payload";
import { getBlockSettingsFields, getPaddingFields } from "@/utils";

export const SyllabusBlock: Block = {
  slug: "syllabus-block",
  labels: {
    singular: "Syllabus",
    plural: "Syllabus blocks",
  },
  interfaceName: "SyllabusBlock",
  fields: [
    {
      name: "levels",
      label: "Levels",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      labels: {
        singular: "Level",
        plural: "Levels",
      },
      fields: [
        {
          name: "label",
          label: "Label",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "title",
          label: "Title",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "subtitle",
          label: "Subtitle",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
        {
          name: "list",
          label: "List",
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
          name: "goal",
          label: "Goal",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
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
