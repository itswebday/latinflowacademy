import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import { getBlockSettingsFields, getHeadingFields } from "@/utils";

export const StoryBlock: Block = {
  slug: "story-block",
  labels: {
    singular: "Story",
    plural: "Story blocks",
  },
  interfaceName: "StoryBlock",
  fields: [
    ...getHeadingFields({ hiddenFields: ["icon"] }),
    {
      name: "main",
      label: "Main content",
      type: "group",
      required: true,
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "name",
          label: "Name",
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
        RichTextField({ name: "text", label: "Text", required: true }),
      ],
    },
    {
      name: "a",
      label: "Content A",
      type: "group",
      required: true,
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "name",
          label: "Name",
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
        RichTextField({ name: "text", label: "Text", required: true }),
      ],
    },
    {
      name: "b",
      label: "Content B",
      type: "group",
      required: true,
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "name",
          label: "Name",
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
        RichTextField({ name: "text", label: "Text", required: true }),
      ],
    },
    ...getBlockSettingsFields(),
  ],
};
