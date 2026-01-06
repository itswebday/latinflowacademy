import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import {
  generateDanceStylesUrl,
  populatePublishedAtGlobalField,
} from "@/hooks";
import { revalidateDanceStyles } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const DanceStyles: GlobalConfig = {
  slug: "dance-styles",
  label: "Dance styles overview",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Dance Styles",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "dance-styles", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "dance-styles", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            ...getHeadingFields({
              fieldName: "heading",
              fieldLabel: "Heading",
              hiddenFields: ["icon"],
            }),
            {
              name: "text",
              label: "Text",
              type: "text",
              defaultValue: "",
              localized: true,
              required: true,
            },
            {
              name: "hlTexts",
              label: "",
              type: "array",
              defaultValue: [],
              labels: {
                singular: "Highlighted text",
                plural: "Highlighted texts",
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
          ],
        },
        {
          name: "meta",
          label: "SEO",
          fields: getMetaFields(),
        },
      ],
    },
    {
      name: "publishedAt",
      label: "Published at",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd-MM-yyyy HH:mm",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [populatePublishedAtGlobalField],
      },
    },
    {
      name: "url",
      label: "Dance Styles URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateDanceStylesUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateDanceStyles],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
