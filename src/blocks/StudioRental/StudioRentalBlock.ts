import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getHeadingFields,
  getPaddingFields,
} from "@/utils";

export const StudioRentalBlock: Block = {
  slug: "studio-rental-block",
  labels: {
    singular: "Studio rental",
    plural: "Studio rental blocks",
  },
  interfaceName: "StudioRentalBlock",
  fields: [
    {
      name: "studios",
      label: "Studios",
      type: "array",
      required: true,
      minRows: 1,
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
        RichTextField({
          name: "description",
          label: "Description",
          required: false,
        }),
        {
          name: "iframeUrl",
          label: "Iframe URL",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
