import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { generateBlogUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidateBlog } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const Blog: GlobalConfig = {
  slug: "blog",
  label: "Blog overview",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Blog",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "blog", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "blog", data }),
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
      label: "Blog URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateBlogUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlog],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
