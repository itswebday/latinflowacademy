import type { GlobalConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { RichTextField } from "@/fields";
import {
  generatePrivacyPolicyUrl,
  populatePublishedAtGlobalField,
} from "@/hooks";
import { revalidatePrivacyPolicy } from "@/hooks/revalidate";
import { getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacy-policy",
  label: "Privacy policy",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Legal Pages",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "privacy-policy", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "privacy-policy", data }),
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
        beforeChange: [generatePrivacyPolicyUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePrivacyPolicy],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
