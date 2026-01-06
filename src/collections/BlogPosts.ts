import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { RichTextField, SlugField } from "@/fields";
import { generateBlogPostUrl, populatePublishedAtCollection } from "@/hooks";
import {
  revalidateBlogPost,
  revalidateBlogPostDelete,
} from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathCollection } from "@/utils/preview";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  labels: {
    singular: "Blog post",
    plural: "Blog posts",
  },
  access: {
    create: developer,
    read: authenticatedOrPublished,
    update: developer,
    delete: developer,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Blog",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "blog-posts",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "blog-posts",
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
      name: "minRead",
      label: "Reading time (minutes)",
      type: "number",
      defaultValue: 3,
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
              label: "Image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            RichTextField({
              name: "content",
              label: "Content",
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
        beforeChange: [generateBlogPostUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlogPost],
    afterDelete: [revalidateBlogPostDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
