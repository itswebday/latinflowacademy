import type { GlobalConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { RichTextField } from "@/fields";
import {
  generateTermsAndConditionsUrl,
  populatePublishedAtGlobalField,
} from "@/hooks";
import { revalidateTermsAndConditions } from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const TermsAndConditions: GlobalConfig = {
  slug: "terms-and-conditions",
  label: "Terms and conditions",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal Pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "terms-and-conditions", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "terms-and-conditions", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
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
        beforeChange: [populatePublishedAtGlobalField],
      },
    },
    {
      name: "url",
      label: "Page URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generateTermsAndConditionsUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateTermsAndConditions],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
