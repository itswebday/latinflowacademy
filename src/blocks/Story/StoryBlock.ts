import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";

export const StoryBlock: Block = {
  slug: "story-block",
  labels: {
    singular: "Story",
    plural: "Story blocks",
  },
  interfaceName: "StoryBlock",
  fields: [
    ...getHeadingFields({
      fieldName: "heading",
      fieldLabel: "Heading",
      hiddenFields: ["icon"],
    }),
    RichTextField({ name: "text", label: "Text", required: true }),
    {
      name: "blueTexts",
      label: "Blue texts",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Blue text",
        plural: "Blue texts",
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
      name: "redTexts",
      label: "Red texts",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Red text",
        plural: "Red texts",
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
      name: "pictures",
      label: "Pictures",
      type: "array",
      maxRows: 3,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "quote",
      label: "Quote",
      type: "text",
      defaultValue: "",
      localized: true,
      required: false,
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
