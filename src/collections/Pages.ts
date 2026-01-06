import type { CollectionConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { blockConfigs } from "@/blocks/config";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { SlugField } from "@/fields";
import {
  generateUrlWithoutLocale,
  populatePublishedAtCollection,
} from "@/hooks";
import { revalidatePage, revalidateDelete } from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathCollection } from "@/utils/preview";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Other page",
    plural: "Other pages",
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "pages",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "pages",
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
          label: "Main content",
          fields: [
            {
              name: "blocks",
              label: "Blocks",
              type: "blocks",
              blocks: blockConfigs,
              defaultValue: [],
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
    SlugField({ readOnly: true }),
    {
      name: "url",
      label: "Page URL (e.g., '/about-us', '/nl/services/websites')",
      type: "text",
      defaultValue: "",
      localized: true,
      unique: true,
      required: true,
      admin: {
        position: "sidebar",
      },
      validate: (
        value: string | string[] | null | undefined,
        { req }: { req?: { locale?: string } },
      ) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "URL cannot be empty";
        }

        if (typeof value !== "string") {
          return "URL must be a string";
        }

        if (value === "/") {
          return "The root path / is reserved for the Home page";
        }

        if (!value.startsWith("/")) {
          return "URL must start with /";
        }

        if (value.endsWith("/")) {
          return "URL must not end with /";
        }

        if (value.includes("//") && !value.startsWith("//")) {
          return "URL must not contain consecutive slashes";
        }

        if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(value)) {
          return "URL must not contain invalid characters";
        }

        const locale = req?.locale || DEFAULT_LOCALE;

        for (const loc of LOCALES) {
          if (value.startsWith(`/${loc}/`) || value === `/${loc}`) {
            if (locale === DEFAULT_LOCALE) {
              return `URL must not start with /${loc} when the locale is
              ${DEFAULT_LOCALE}`;
            }
            if (locale !== loc) {
              return `URL cannot start with /${loc} when the locale is
              ${locale}`;
            }

            if (value === `/${loc}`) {
              return `The path /${loc} is reserved for the Home page`;
            }

            return true;
          }
        }

        if (locale === DEFAULT_LOCALE) {
          return true;
        } else {
          return `URL must start with /${locale} when locale is ${locale}`;
        }
      },
    },
    {
      name: "urlWithoutLocale",
      label: "URL without locale",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically generated from URL",
      },
      hooks: {
        beforeChange: [generateUrlWithoutLocale],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
