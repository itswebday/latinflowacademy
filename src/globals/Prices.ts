import type { GlobalConfig } from "payload";
import { authenticatedOrPublished, developer } from "@/access";
import { blockConfigs } from "@/blocks/config";
import { RichTextField } from "@/fields";
import { generatePricesUrl, populatePublishedAtGlobalField } from "@/hooks";
import { revalidatePrices } from "@/hooks/revalidate";
import { getHeadingFields, getMetaFields } from "@/utils";
import { getPreviewPathGlobal } from "@/utils/preview";

export const Prices: GlobalConfig = {
  slug: "prices",
  label: "Prices",
  access: {
    read: authenticatedOrPublished,
    update: developer,
  },
  admin: {
    group: "Content",
    livePreview: {
      url: async ({ data }) =>
        await getPreviewPathGlobal({ global: "prices", data }),
    },
    preview: async (data) =>
      await getPreviewPathGlobal({ global: "prices", data }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Heading",
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
                RichTextField({
                  name: "text",
                  label: "Text",
                  required: true,
                }),
              ],
            },
          ],
        },
        {
          label: "Punch cards",
          fields: [
            ...getHeadingFields({
              fieldName: "punchCardsHeading",
              fieldLabel: "Punch cards heading",
              hiddenFields: ["icon"],
            }),
            {
              name: "punchCards",
              label: "Punch cards",
              type: "array",
              defaultValue: [],
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "title",
                  label: "Title",
                  type: "text",
                  defaultValue: "",
                  localized: true,
                  required: true,
                },
                {
                  name: "subtitle",
                  label: "Subtitle (optional)",
                  type: "text",
                  defaultValue: "",
                  localized: true,
                },
                {
                  name: "price",
                  label: "Price (e.g., '€19')",
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
                  name: "discount",
                  label: "Discount (€)",
                  type: "number",
                  defaultValue: 0,
                },
                {
                  name: "newPrice",
                  label: "New price (e.g., '€15')",
                  type: "text",
                  defaultValue: "",
                  localized: true,
                  required: true,
                  admin: {
                    condition: (_, siblingData) => {
                      return (
                        siblingData?.discount !== undefined &&
                        siblingData?.discount !== null &&
                        siblingData?.discount > 0
                      );
                    },
                  },
                },
                {
                  name: "details",
                  label: "Details",
                  type: "array",
                  minRows: 1,
                  required: true,
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: "detail",
                      label: "",
                      type: "text",
                      defaultValue: "",
                      localized: true,
                      required: true,
                    },
                  ],
                },
                {
                  name: "button",
                  label: "Button",
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
                    {
                      name: "url",
                      label: "URL",
                      type: "text",
                      defaultValue: "",
                    },
                  ],
                },
                {
                  name: "style",
                  label: "Style",
                  type: "group",
                  required: true,
                  fields: [
                    {
                      name: "color",
                      label: "Color",
                      type: "select",
                      defaultValue: "primary",
                      required: true,
                      options: [
                        {
                          label: "Primary",
                          value: "primary",
                        },
                        {
                          label: "Blue",
                          value: "blue",
                        },
                        {
                          label: "Green",
                          value: "green",
                        },
                        {
                          label: "Red",
                          value: "red",
                        },
                        {
                          label: "Orange",
                          value: "orange",
                        },
                        {
                          label: "Yellow",
                          value: "yellow",
                        },
                      ],
                    },
                    {
                      name: "mostPopular",
                      label: "Most Popular",
                      type: "checkbox",
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Memberships",
          fields: [
            ...getHeadingFields({
              fieldName: "membershipsHeading",
              fieldLabel: "Memberships heading",
              hiddenFields: ["icon"],
            }),
            {
              name: "memberships",
              label: "Memberships",
              type: "array",
              defaultValue: [],
              minRows: 1,
              required: true,
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "title",
                  label: "Title",
                  type: "text",
                  defaultValue: "",
                  required: true,
                },
                {
                  name: "subtitle",
                  label: "Subtitle (optional)",
                  type: "text",
                  defaultValue: "",
                  localized: true,
                },
                {
                  name: "price",
                  label: "Price (e.g., '€99/month')",
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
                  name: "discount",
                  label: "Discount (%)",
                  type: "number",
                  defaultValue: 0,
                },
                {
                  name: "newPrice",
                  label: "New price (e.g., '€79/month')",
                  type: "text",
                  defaultValue: "",
                  localized: true,
                  required: true,
                  admin: {
                    condition: (_, siblingData) => {
                      return (
                        siblingData?.discount !== undefined &&
                        siblingData?.discount !== null &&
                        siblingData?.discount > 0
                      );
                    },
                  },
                },
                {
                  name: "details",
                  label: "Details",
                  type: "array",
                  minRows: 1,
                  required: true,
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: "detail",
                      label: "",
                      type: "text",
                      defaultValue: "",
                      localized: true,
                    },
                  ],
                },
                {
                  name: "button",
                  label: "Button",
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
                    {
                      name: "url",
                      label: "Bueno URL (leave empty to specify plan options)",
                      type: "text",
                      defaultValue: "",
                    },
                  ],
                },
                {
                  name: "options",
                  label: "Payment plan options",
                  type: "array",
                  minRows: 1,
                  required: true,
                  admin: {
                    condition: (_, siblingData) => {
                      return (
                        !siblingData?.button?.url ||
                        siblingData.button.url === "" ||
                        siblingData.button.url.trim() === ""
                      );
                    },
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: "price",
                      label: "Price",
                      type: "text",
                      defaultValue: "",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "text",
                      label: "Text",
                      type: "text",
                      defaultValue: "",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "url",
                      label: "Bueno URL",
                      type: "text",
                      defaultValue: "",
                      required: true,
                    },
                  ],
                },
                {
                  name: "style",
                  label: "Style",
                  type: "group",
                  required: true,
                  fields: [
                    {
                      name: "color",
                      label: "Color",
                      type: "select",
                      defaultValue: "primary",
                      required: true,
                      options: [
                        {
                          label: "Primary",
                          value: "primary",
                        },
                        {
                          label: "Blue",
                          value: "blue",
                        },
                        {
                          label: "Green",
                          value: "green",
                        },
                        {
                          label: "Red",
                          value: "red",
                        },
                        {
                          label: "Orange",
                          value: "orange",
                        },
                        {
                          label: "Yellow",
                          value: "yellow",
                        },
                      ],
                    },
                    {
                      name: "mostPopular",
                      label: "Most Popular",
                      type: "checkbox",
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Content",
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
        beforeChange: [populatePublishedAtGlobalField],
      },
    },
    {
      name: "url",
      label: "Prices URL",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically set",
      },
      hooks: {
        beforeChange: [generatePricesUrl],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePrices],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
