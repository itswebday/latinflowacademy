import type { Block } from "payload";
import {
  getBlockSettingsFields,
  getBlockStyleFields,
  getPaddingFields,
} from "@/utils";

export const ScheduleBlock: Block = {
  slug: "schedule-block",
  labels: {
    singular: "Schedule",
    plural: "Schedule blocks",
  },
  interfaceName: "ScheduleBlock",
  fields: [
    {
      name: "iframeUrl",
      label: "Iframe URL",
      type: "textarea",
      defaultValue: "",
      required: true,
    },
    ...getBlockStyleFields(),
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
