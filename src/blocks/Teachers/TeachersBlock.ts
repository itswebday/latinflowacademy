import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const TeachersBlock: Block = {
  slug: "teachers-block",
  labels: {
    singular: "Teachers",
    plural: "Teachers blocks",
  },
  interfaceName: "TeachersBlock",
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
