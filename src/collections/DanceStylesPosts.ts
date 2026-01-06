import type { CollectionConfig } from "payload";
import { admin, authenticatedOrPublished } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import { generateDanceStyleUrl, populatePublishedAtCollection } from "@/hooks";
import {
  revalidateDanceStyle,
  revalidateDanceStyleDelete,
} from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathCollection } from "@/utils/preview";

export const DanceStylesPosts: CollectionConfig = {
  slug: "dance-styles-posts",
  labels: {
    singular: "Dance style",
    plural: "Dance styles",
  },
  access: {
    create: admin,
    read: authenticatedOrPublished,
    update: admin,
    delete: admin,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "url", "updatedAt"],
    group: "Dance Styles",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "dance-styles-posts",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "dance-styles-posts",
      }),
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "squareImage",
              label: "Square image (preferably as a .webp file)",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "landscapeImage",
              label: "Landscape image (preferably as a .webp file)",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "title",
              label: "Title",
              type: "text",
              defaultValue: "",
              localized: true,
              required: true,
            },
            RichTextField({
              name: "description",
              label: "Description",
              required: true,
            }),
            {
              name: "iframeUrl",
              label: "Training URL",
              type: "text",
              defaultValue: "",
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
        beforeChange: [populatePublishedAtCollection],
      },
    },
    SlugField({ readOnly: true, generatedFrom: "name" }),
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
        beforeChange: [generateDanceStyleUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateDanceStyle],
    afterDelete: [revalidateDanceStyleDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
