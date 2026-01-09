import type { GlobalConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { DEFAULT_LOCALE } from "@/constants";
import type { LocaleOption } from "@/types";
import { getButtonLinkFields, getHeadingFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import { getGlobal } from "@/utils/server";

export const Hero: GlobalConfig = {
  slug: "hero",
  label: "Hero section",
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: "Pages",
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
    ...getButtonLinkFields({
      excludePages: [
        "home",
        "blog",
        "events",
        "privacy-policy",
        "cookie-policy",
        "terms-and-conditions",
      ],
    }),
    ...getButtonLinkFields({
      fieldName: "button2",
      fieldLabel: "Second button",
      optional: true,
      excludePages: [
        "home",
        "blog",
        "events",
        "privacy-policy",
        "cookie-policy",
        "terms-and-conditions",
      ],
    }),
  ],
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
