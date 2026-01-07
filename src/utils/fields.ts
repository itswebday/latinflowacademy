import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { Field } from "payload";

export const getMetaFields = ({
  hiddenFields = [],
  relationTo = "media",
}: {
  hiddenFields?: string[];
  relationTo?: string;
} = {}): Field[] => {
  const overviewField = OverviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
    imagePath: "meta.image",
  });
  const titleField = MetaTitleField({});
  const descriptionField = MetaDescriptionField({});
  const imageField = MetaImageField({
    relationTo: relationTo,
  });
  const previewField = PreviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
  });

  return [
    {
      ...overviewField,
      admin: {
        ...(overviewField.admin || {}),
        ...(hiddenFields.includes("overview") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...titleField,
      admin: {
        ...(titleField.admin || {}),
        ...(hiddenFields.includes("title") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...descriptionField,
      admin: {
        ...(descriptionField.admin || {}),
        ...(hiddenFields.includes("description") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...imageField,
      admin: {
        ...(imageField.admin || {}),
        ...(hiddenFields.includes("image") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...previewField,
      admin: {
        ...(previewField.admin || {}),
        ...(hiddenFields.includes("preview") ? { hidden: true } : {}),
      },
    } as Field,
  ];
};

export const getBlockStyleFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "background",
      label: "Background color",
      type: "select",
      options: [
        {
          label: "Transparent",
          value: "transparent",
        },
        {
          label: "White",
          value: "white",
        },
        {
          label: "Light",
          value: "light",
        },
      ],
      defaultValue: "transparent",
      required: true,
      admin: hiddenFields.includes("background") ? { hidden: true } : undefined,
    },
  ];
};

export const getPaddingFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "paddingTop",
      label: "Padding top",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
      admin: hiddenFields.includes("paddingTop") ? { hidden: true } : undefined,
    },
    {
      name: "paddingBottom",
      label: "Padding bottom",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
      admin: hiddenFields.includes("paddingBottom")
        ? { hidden: true }
        : undefined,
    },
  ];
};

export const getBlockSettingsFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "applyCustomId",
      label: "Apply custom ID",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("applyCustomId")
        ? { hidden: true }
        : undefined,
    },
    {
      name: "customId",
      label: "Custom ID",
      type: "text",
      defaultValue: "",
      required: true,
      admin: {
        ...(hiddenFields.includes("customId")
          ? { hidden: true }
          : {
              condition: (_, siblingData) => {
                return siblingData?.applyCustomId === true;
              },
            }),
      },
    },
    {
      name: "hidden",
      label: "Hidden",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("hidden") ? { hidden: true } : undefined,
    },
  ];
};

export const getHeadingFields = ({
  fieldName = "heading",
  fieldLabel = "Heading",
  hiddenFields = [],
  optional = false,
}: {
  fieldName?: string;
  fieldLabel?: string;
  hiddenFields?: string[];
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "icon",
      label: "Icon (optional)",
      type: "upload",
      relationTo: "media",
      admin: hiddenFields.includes("icon") ? { hidden: true } : undefined,
    },
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
      required: true,
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    },
    {
      name: "hlTexts",
      label: "",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Highlighted text",
        plural: "Highlighted texts",
      },
      admin: hiddenFields.includes("hlTexts")
        ? { hidden: true, initCollapsed: true }
        : { initCollapsed: true },
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
  ];

  if (optional) {
    const showFieldName = `show${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }`;

    return [
      {
        name: showFieldName,
        label: `Show ${fieldLabel}`,
        type: "checkbox",
        defaultValue: false,
        admin: hiddenFields.includes(showFieldName)
          ? { hidden: true }
          : undefined,
      },
      {
        name: fieldName,
        label: fieldLabel,
        type: "group",
        required: true,
        admin: {
          ...(hiddenFields.includes(fieldName)
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.[showFieldName] === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return [
    {
      name: fieldName,
      label: fieldLabel,
      type: "group",
      required: true,
      admin: hiddenFields.includes(fieldName) ? { hidden: true } : undefined,
      fields,
    },
  ];
};

export const getLinkFields = ({
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  excludeTextField = false,
  excludePages = ["privacy-policy", "cookie-policy", "terms-and-conditions"],
}: {
  hiddenFields?: string[];
  includeDropdown?: boolean;
  localizedText?: boolean;
  excludeTextField?: boolean;
  excludePages?: string[];
} = {}): Field[] => {
  const baseFields: Field[] = [];

  if (!excludeTextField) {
    baseFields.push({
      name: "text",
      label: "Text",
      type: "text",
      localized: localizedText,
      required: true,
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    });
  }

  baseFields.push({
    name: "custom",
    label: "Custom URL",
    type: "checkbox",
    defaultValue: hiddenFields.includes("custom") ? true : false,
    admin: {
      ...(hiddenFields.includes("custom")
        ? { hidden: true }
        : {
            condition: includeDropdown
              ? (_, siblingData) => {
                  return !siblingData?.dropdown || siblingData?.clickable;
                }
              : undefined,
          }),
    },
  });

  baseFields.push({
    name: "url",
    label: "URL (e.g., 'https://www.itswebday.com')",
    type: "text",
    defaultValue: "",
    localized: false,
    required: true,
    admin: {
      ...(hiddenFields.includes("url")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return siblingData?.custom;
            },
          }),
    },
  });

  baseFields.push({
    name: "scroll",
    label: "Smooth scroll to a block",
    type: "checkbox",
    defaultValue: false,
    admin: {
      ...(hiddenFields.includes("scroll")
        ? { hidden: true }
        : {
            condition: includeDropdown
              ? (_, siblingData) => {
                  if (siblingData?.custom) {
                    return false;
                  }

                  return !siblingData?.dropdown || siblingData?.clickable;
                }
              : (_, siblingData) => {
                  return !siblingData?.custom;
                },
          }),
    },
  });

  baseFields.push({
    name: "targetPage",
    label: "Target page (optional)",
    type: "select",
    options: [
      {
        label: "Current page",
        value: "current",
      },
      {
        label: "Home page",
        value: "home",
      },
      {
        label: "Other page",
        value: "page",
      },
    ],
    defaultValue: "current",
    required: false,
    admin: {
      ...(hiddenFields.includes("targetPage")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.custom) {
                return false;
              }

              if (includeDropdown) {
                return (
                  siblingData?.scroll &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }

              return siblingData?.scroll;
            },
          }),
    },
  });

  const urlTypeOptions = [
    { label: "Select the page to link to", value: "" },
    { label: "Home page", value: "home" },
    { label: "Other page", value: "page" },
    { label: "Blog overview", value: "blog" },
    { label: "Blog post", value: "blog-post" },
    { label: "Events overview", value: "events" },
    { label: "Event post", value: "event-post" },
    { label: "Privacy policy", value: "privacy-policy" },
    { label: "Cookie policy", value: "cookie-policy" },
    { label: "Terms and conditions", value: "terms-and-conditions" },
  ].filter((option) => !excludePages.includes(option.value));

  baseFields.push({
    name: "urlType",
    label: "Link type",
    type: "select",
    options: urlTypeOptions,
    defaultValue: "",
    required: true,
    admin: {
      ...(hiddenFields.includes("urlType")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return !siblingData?.custom;
            },
          }),
    },
  });

  baseFields.push({
    name: "page",
    label: "Page",
    type: "relationship",
    relationTo: ["pages"],
    required: true,
    admin: {
      ...(hiddenFields.includes("page")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll && siblingData?.targetPage === "page") {
                return true;
              }

              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.urlType === "page"
                );
              }
              return !siblingData?.custom && siblingData?.urlType === "page";
            },
          }),
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData?: Record<string, unknown> },
    ) => {
      if (siblingData?.scroll && siblingData?.targetPage === "page" && !value) {
        return "Page is required when 'Target page' is 'Other page'";
      }

      if (includeDropdown) {
        if (
          !siblingData?.custom &&
          (!siblingData?.dropdown || siblingData?.clickable) &&
          siblingData?.urlType === "page" &&
          !value
        ) {
          return "Page is required when 'Link type' is 'Other page'";
        }
      } else {
        if (!siblingData?.custom && siblingData?.urlType === "page" && !value) {
          return "Page is required when 'Link type' is 'Other page'";
        }
      }
      return true;
    },
  });

  baseFields.push({
    name: "blogPost",
    label: "Blog post",
    type: "relationship",
    relationTo: ["blog-posts"],
    required: true,
    admin: {
      ...(hiddenFields.includes("blogPost")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.urlType === "blog-post"
                );
              }
              return (
                !siblingData?.custom && siblingData?.urlType === "blog-post"
              );
            },
          }),
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData?: Record<string, unknown> },
    ) => {
      if (includeDropdown) {
        if (
          !siblingData?.custom &&
          (!siblingData?.dropdown || siblingData?.clickable) &&
          siblingData?.urlType === "blog-post" &&
          !value
        ) {
          return "Blog post is required when 'Link type' is 'Blog post'";
        }
      } else {
        if (
          !siblingData?.custom &&
          siblingData?.urlType === "blog-post" &&
          !value
        ) {
          return "Blog post is required when 'Link type' is 'Blog post'";
        }
      }
      return true;
    },
  });

  baseFields.push({
    name: "eventPost",
    label: "Event post",
    type: "relationship",
    relationTo: ["events-posts"],
    required: true,
    admin: {
      ...(hiddenFields.includes("eventPost")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.urlType === "event-post"
                );
              }
              return (
                !siblingData?.custom && siblingData?.urlType === "event-post"
              );
            },
          }),
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData?: Record<string, unknown> },
    ) => {
      if (includeDropdown) {
        if (
          !siblingData?.custom &&
          (!siblingData?.dropdown || siblingData?.clickable) &&
          siblingData?.urlType === "event-post" &&
          !value
        ) {
          return "Event post is required when 'Link type' is 'Event post'";
        }
      } else {
        if (
          !siblingData?.custom &&
          siblingData?.urlType === "event-post" &&
          !value
        ) {
          return "Event post is required when 'Link type' is 'Event post'";
        }
      }
      return true;
    },
  });

  baseFields.push({
    name: "scrollTarget",
    label: "Target block (e.g., 'text-block-1', 'visual-block-3', 'footer')",
    type: "text",
    defaultValue: "",
    localized: false,
    required: true,
    admin: {
      ...(hiddenFields.includes("scrollTarget")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.custom) {
                return false;
              }

              if (includeDropdown) {
                return (
                  siblingData?.scroll &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }

              return siblingData?.scroll;
            },
          }),
    },
  });

  baseFields.push({
    name: "newTab",
    label: "Open in a new tab",
    type: "checkbox",
    defaultValue: false,
    admin: hiddenFields.includes("newTab")
      ? { hidden: true }
      : {
          condition: (_, siblingData) => {
            if (siblingData?.scroll) {
              return false;
            }
            if (
              siblingData?.dropdown === true &&
              siblingData?.clickable === false
            ) {
              return false;
            }
            return true;
          },
        },
  });

  if (includeDropdown) {
    baseFields.push({
      name: "dropdown",
      label: "Dropdown link",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("dropdown") ? { hidden: true } : undefined,
    });

    baseFields.push({
      name: "clickable",
      label: "Clickable",
      type: "checkbox",
      defaultValue: true,
      admin: {
        ...(hiddenFields.includes("clickable")
          ? { hidden: true }
          : {
              condition: (_, siblingData) => {
                return siblingData?.dropdown === true;
              },
            }),
      },
    });
  }

  return baseFields;
};

export const getButtonLinkFields = ({
  fieldName = "button",
  fieldLabel = "Button",
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  optional = false,
  excludePages = ["privacy-policy", "cookie-policy", "terms-and-conditions"],
}: {
  fieldName?: string;
  fieldLabel?: string;
  hiddenFields?: string[];
  includeDropdown?: boolean;
  localizedText?: boolean;
  optional?: boolean;
  excludePages?: string[];
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "variant",
      label: "Variant",
      type: "select",
      options: [
        {
          label: "Primary button",
          value: "primaryButton",
        },
        {
          label: "White button",
          value: "whiteButton",
        },
        {
          label: "Dark button",
          value: "darkButton",
        },
        {
          label: "Transparent button",
          value: "transparentButton",
        },
      ],
      defaultValue: "primaryButton",
      required: true,
      admin: hiddenFields.includes("variant") ? { hidden: true } : undefined,
    },
    ...getLinkFields({
      hiddenFields,
      includeDropdown,
      localizedText,
      excludePages,
    }),
  ];

  if (optional) {
    const showFieldName = `show${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }`;

    return [
      {
        name: showFieldName,
        label: `Show ${fieldLabel}`,
        type: "checkbox",
        defaultValue: false,
        admin: hiddenFields.includes(showFieldName)
          ? { hidden: true }
          : undefined,
      },
      {
        name: fieldName,
        label: fieldLabel,
        type: "group",
        required: true,
        admin: {
          ...(hiddenFields.includes(fieldName)
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.[showFieldName] === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return [
    {
      name: fieldName,
      label: fieldLabel,
      type: "group",
      required: true,
      admin: hiddenFields.includes(fieldName) ? { hidden: true } : undefined,
      fields,
    },
  ];
};

export const getImageFields = ({
  fieldName = "image",
  fieldLabel = "Image",
  hiddenFields = [],
  optional = false,
}: {
  fieldName?: string;
  fieldLabel?: string;
  hiddenFields?: string[];
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "file",
      label: "File",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: hiddenFields.includes("file") ? { hidden: true } : undefined,
    },
    {
      name: "posMo",
      label: "Image position (mobile screens)",
      type: "select",
      options: [
        {
          label: "Top",
          value: "top",
        },
        {
          label: "Bottom",
          value: "bottom",
        },
      ],
      defaultValue: "bottom",
      required: true,
      admin: hiddenFields.includes("positionMo") ? { hidden: true } : undefined,
    },
    {
      name: "posDe",
      label: "Image position (desktop screens)",
      type: "select",
      options: [
        {
          label: "Left",
          value: "left",
        },
        {
          label: "Right",
          value: "right",
        },
      ],
      defaultValue: "right",
      required: true,
      admin: hiddenFields.includes("positionDe") ? { hidden: true } : undefined,
    },
    {
      name: "fit",
      label: "Image fit",
      type: "select",
      options: [
        {
          label: "Contain",
          value: "contain",
        },
        {
          label: "Cover",
          value: "cover",
        },
      ],
      defaultValue: "contain",
      required: true,
      admin: hiddenFields.includes("fit") ? { hidden: true } : undefined,
    },
    {
      name: "width",
      label: "Image width (desktop screens, % of the section width)",
      type: "number",
      min: 0,
      max: 100,
      defaultValue: 50,
      required: true,
      admin: hiddenFields.includes("widthDe") ? { hidden: true } : undefined,
    },
    {
      name: "height",
      label: "Image height",
      type: "select",
      options: [
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
      admin: hiddenFields.includes("height")
        ? { hidden: true }
        : {
            condition: (_data, siblingData) => {
              return siblingData?.fit !== "contain";
            },
          },
    },
  ];

  if (optional) {
    const showFieldName = `show${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }`;

    return [
      {
        name: showFieldName,
        label: `Show ${fieldLabel}`,
        type: "checkbox",
        defaultValue: false,
        admin: hiddenFields.includes(showFieldName)
          ? { hidden: true }
          : undefined,
      },
      {
        name: fieldName,
        label: fieldLabel,
        type: "group",
        required: true,
        admin: {
          ...(hiddenFields.includes(fieldName)
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.[showFieldName] === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return [
    {
      name: fieldName,
      label: fieldLabel,
      type: "group",
      required: true,
      admin: hiddenFields.includes(fieldName) ? { hidden: true } : undefined,
      fields,
    },
  ];
};
