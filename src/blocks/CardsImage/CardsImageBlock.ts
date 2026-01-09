import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getButtonLinkFields,
  getHeadingFields,
  getImageFields,
  getPaddingFields,
} from "@/utils";

export const CardsImageBlock: Block = {
  slug: "cards-image-block",
  labels: {
    singular: "Cards and Image",
    plural: "Cards and Image blocks",
  },
  interfaceName: "CardsImageBlock",
  fields: [
    ...getHeadingFields({ optional: true }),
    {
      name: "cards",
      label: "Cards",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      fields: [
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
      ],
    },
    ...getButtonLinkFields({ optional: true }),
    ...getImageFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
