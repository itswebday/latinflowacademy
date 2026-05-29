import type { Block } from "payload";
import { RichTextField } from "@/fields/RichTextField";
import {
  getBlockSettingsFields,
  getHeadingFields,
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
    ...getHeadingFields({ optional: true }),
    {
      name: "teachers",
      label: "Teachers",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "photo",
          label: "Photo",
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
          name: "role",
          label: "Role (optional)",
          type: "text",
          defaultValue: "",
          localized: true,
          required: false,
        },
        RichTextField({
          name: "bio",
          label: "Short bio",
          required: true,
        }),
        {
          name: "styles",
          label: "Dance styles (optional)",
          type: "array",
          defaultValue: [],
          required: false,
          admin: {
            description:
              "Tags shown as chips under the role, e.g. Salsa, Bachata, Kizomba.",
          },
          fields: [
            {
              name: "tag",
              label: "Tag",
              type: "text",
              defaultValue: "",
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
    ...getPaddingFields(),
    ...getBlockSettingsFields(),
  ],
};
