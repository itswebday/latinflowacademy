import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { generateTeachersUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateTeachers } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const Teachers: GlobalConfig = {
  slug: "teachers",
  label: "Teachers overview",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Teachers",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "teachers", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "teachers", data }),
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
      label: "Teachers URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateTeachersUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateTeachers],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
