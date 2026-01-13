import type { Block } from "payload";
import { getBlockSettingsFields, getPaddingFields } from "@/utils";

export const HeadingBlock: Block = {
  slug: "heading-block",
  labels: {
    singular: "Heading",
    plural: "Heading blocks",
  },
  interfaceName: "HeadingBlock",
  fields: [
    {
      name: "icon",
      label: "Icon",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
      required: true,
    },
    {
      name: "tagName",
      label: "Heading size",
      type: "select",
      options: [
        {
          label: "H1",
          value: "h1",
        },
        {
          label: "H2",
          value: "h2",
        },
        {
          label: "H3",
          value: "h3",
        },
        {
          label: "H4",
          value: "h4",
        },
        {
          label: "H5",
          value: "h5",
        },
        {
          label: "H6",
          value: "h6",
        },
      ],
      defaultValue: "h1",
      required: true,
    },
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
    },
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
