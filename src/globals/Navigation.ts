import type { GlobalConfig } from "payload";
import { authenticated, authenticatedOrPublished } from "@/access";
import { DEFAULT_LOCALE } from "@/constants";
import { revalidateNavigation } from "@/hooks/revalidate";
import type { LocaleOption } from "@/types";
import { getButtonLinkFields, getLinkFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";
import { getGlobal } from "@/utils/server";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
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
      name: "links",
      label: "Links",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Link",
        plural: "Links",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        ...getLinkFields({ includeDropdown: true }),
        {
          name: "sublinks",
          label: "Sublinks",
          type: "array",
          defaultValue: [],
          admin: {
            initCollapsed: true,
            condition: (_, siblingData) => {
              return siblingData?.dropdown === true;
            },
          },
          labels: {
            singular: "Sublink",
            plural: "Sublinks",
          },
          fields: getLinkFields(),
        },
        {
          name: "showOnEveryPage",
          label: "Show on every page",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "showOnHomePage",
          label: "Show on home page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnBlogPage",
          label: "Show on blog page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnEventsPage",
          label: "Show on events page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnPricesPage",
          label: "Show on prices page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnSchedulePage",
          label: "Show on schedule page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnLegalPages",
          label: "Show on legal pages",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "pages",
          label: "Other pages where this link should be visible",
          type: "relationship",
          relationTo: "pages",
          hasMany: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
      ],
    },
    ...getButtonLinkFields({ optional: true, hiddenFields: ["centered"] }),
    {
      name: "slideOutMenu",
      label: "Slide out menu",
      type: "checkbox",
      defaultValue: false,
      required: false,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateNavigation],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
