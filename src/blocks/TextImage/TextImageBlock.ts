import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getButtonLinkFields,
  getHeadingFields,
  getImageFields,
  getPaddingFields,
} from "@/utils";

export const TextImageBlock: Block = {
  slug: "text-image-block",
  labels: {
    singular: "Text and Image",
    plural: "Text and Image blocks",
  },
  interfaceName: "TextImageBlock",
  fields: [
    ...getHeadingFields({ optional: true }),
    {
      name: "text",
      label: "Text",
      type: "group",
      required: true,
      fields: [RichTextField({ required: true })],
    },
    ...getButtonLinkFields({ optional: true }),
    ...getButtonLinkFields({
      fieldName: "button2",
      fieldLabel: "Second button",
      optional: true,
    }),
    ...getImageFields(),
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
