import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { RichTextField } from "@/fields";
import { generateScheduleUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateSchedule } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const Schedule: GlobalConfig = {
  slug: "schedule",
  label: "Schedule",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Content",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "schedule", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "schedule", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            ...getHeadingFields({
              hiddenFields: ["icon"],
            }),
            {
              name: "paragraph",
              label: "Paragraph",
              type: "group",
              required: true,
              fields: [
                RichTextField({
                  name: "text",
                  label: "Text",
                  required: true,
                }),
              ],
            },
            {
              name: "embedCode",
              label: "Embed Code",
              type: "textarea",
              defaultValue: "",
              required: false,
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
      label: "Schedule URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateScheduleUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSchedule],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
