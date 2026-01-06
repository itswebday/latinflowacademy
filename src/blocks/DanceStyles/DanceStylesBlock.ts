import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const DanceStylesBlock: Block = {
  slug: "dance-styles-block",
  labels: {
    singular: "Dance styles",
    plural: "Dance styles blocks",
  },
  interfaceName: "DanceStylesBlock",
  fields: [
    {
      name: "swiper",
      label: "Swiper",
      type: "checkbox",
      defaultValue: false,
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
