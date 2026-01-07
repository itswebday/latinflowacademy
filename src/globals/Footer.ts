import type { GlobalConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { DEFAULT_LOCALE } from "@/constants";
import { revalidateFooter } from "@/hooks/revalidate";
import type { LocaleOption } from "@/types";
import { getLinkFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import { getGlobal } from "@/utils/server";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "General",
    livePreview: {
      url: async ({ locale }) => {
        const loc = (locale as unknown as LocaleOption) || DEFAULT_LOCALE;
        const home = await getGlobal("home", loc, true);
        const homeData = home
          ? ({ url: home.url } as Record<string, unknown>)
          : undefined;

        return await getPreviewPathGlobal({ global: "home", data: homeData });
      },
    },
    preview: async ({ locale }) => {
      const loc = (locale as unknown as LocaleOption) || DEFAULT_LOCALE;
      const home = await getGlobal("home", loc, true);
      const homeData = home
        ? ({ url: home.url } as Record<string, unknown>)
        : undefined;

      return await getPreviewPathGlobal({ global: "home", data: homeData });
    },
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "Paragraph",
      label: "Paragraph",
      type: "text",
      defaultValue: "",
      localized: true,
    },
    {
      name: "email",
      label: "Email",
      type: "group",
      required: true,
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "phone",
      label: "Phone",
      type: "group",
      required: true,
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "group",
      required: true,
      fields: [
        {
          name: "line1",
          label: "Line 1",
          type: "text",
          defaultValue: "",
          required: true,
        },
        {
          name: "line2",
          label: "Line 2 (optional)",
          type: "text",
          defaultValue: "",
        },
        {
          name: "line3",
          label: "Line 3 (optional)",
          type: "text",
          defaultValue: "",
        },
        {
          name: "url",
          label: "URL",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "openingHours",
      labels: {
        singular: "Line",
        plural: "Opening hours",
      },
      type: "array",
      defaultValue: [],
      minRows: 1,
      maxRows: 4,
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "socialMediaLinks",
      label: "Social media links",
      type: "array",
      defaultValue: [],
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Social media link",
        plural: "Social media links",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "icon",
          label: "Icon (SVG file)",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "url",
          label: "Link (URL)",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "legalLinks",
      label: "Legal links",
      type: "array",
      defaultValue: [],
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Legal link",
        plural: "Legal links",
      },
      admin: {
        initCollapsed: true,
      },
      fields: getLinkFields({
        excludePages: [],
      }),
    },
    {
      name: "companyDetails",
      label: "Company details",
      type: "group",
      required: true,
      fields: [
        {
          name: "crn",
          label: "Company registration number/KvK number",
          type: "text",
          defaultValue: "",
          required: true,
        },
        {
          name: "vat",
          label: "VAT/BTW number",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
