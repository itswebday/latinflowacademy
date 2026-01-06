import type { CollectionConfig } from "payload";
import { admin, authenticatedOrPublished } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import { generateNewsPostUrl, populatePublishedAtCollection } from "@/hooks";
import {
  revalidateNewsPost,
  revalidateNewsPostDelete,
} from "@/hooks/revalidate";
import { getButtonLinkFields, getMetaFields } from "@/utils";
import { getPreviewPathCollection } from "@/utils/preview";

export const NewsPosts: CollectionConfig = {
  slug: "news-posts",
  labels: {
    singular: "News post",
    plural: "News posts",
  },
  access: {
    create: admin,
    read: authenticatedOrPublished,
    update: admin,
    delete: admin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "date"],
    group: "News",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "news-posts",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "news-posts",
      }),
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "image",
              label: "Image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "date",
              label: "Date and time",
              type: "date",
              admin: {
                date: {
                  pickerAppearance: "dayAndTime",
                  displayFormat: "d MMM yyyy HH:mm",
                },
              },
            },
            RichTextField({
              name: "summary",
              label: "Short summary (appears in the news overview page)",
              required: true,
            }),
            RichTextField({
              name: "content",
              label: "Full description (appears on the news post page)",
              required: true,
            }),
            ...getButtonLinkFields({ optional: true }),
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
        beforeChange: [populatePublishedAtCollection],
      },
    },
    SlugField({ readOnly: true }),
    {
      name: "url",
      label: "URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically generated from slug",
      },
      hooks: {
        beforeChange: [generateNewsPostUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateNewsPost],
    afterDelete: [revalidateNewsPostDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
