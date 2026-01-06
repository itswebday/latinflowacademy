import type { CollectionConfig } from "payload";
import { admin, authenticatedOrPublished } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import { generateTeacherUrl, populatePublishedAtCollection } from "@/hooks";
import { revalidateTeacher, revalidateTeacherDelete } from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathCollection } from "@/utils/preview";

export const TeachersPosts: CollectionConfig = {
  slug: "teachers-posts",
  labels: {
    singular: "Teacher",
    plural: "Teachers",
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
    group: "Teachers",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "teachers-posts",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "teachers-posts",
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
              name: "image",
              label: "Image (preferably as a .webp file)",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            RichTextField({
              name: "description",
              label: "Description",
              required: true,
            }),
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
        beforeChange: [generateTeacherUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateTeacher],
    afterDelete: [revalidateTeacherDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
