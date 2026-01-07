import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { generateEventsUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateEvents } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const Events: GlobalConfig = {
  slug: "events",
  label: "Events overview",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Events",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "events", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "events", data }),
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
                {
                  name: "text",
                  label: "Text",
                  type: "textarea",
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
      label: "Events URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateEventsUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateEvents],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
