import type { CollectionConfig } from "payload";
import { developer } from "@/access";
import { getLinkFields } from "@/utils";

export const Forms: CollectionConfig = {
  slug: "forms",
  labels: {
    singular: "Form",
    plural: "Forms",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    group: "Content",
  },
  access: {
    create: developer,
    read: () => true,
    update: developer,
    delete: developer,
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
      name: "description",
      label: "Description",
      type: "text",
      defaultValue: "",
      localized: true,
    },
    {
      name: "fields",
      label: "Input fields",
      type: "array",
      labels: {
        singular: "Field",
        plural: "Fields",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "name",
          label: "Name of the field",
          type: "text",
          defaultValue: "",
          localized: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            {
              label: "Select the type of the field",
              value: "",
            },
            {
              label: "Text",
              value: "text",
            },
            {
              label: "Textarea",
              value: "textarea",
            },
            {
              label: "Email",
              value: "email",
            },
            {
              label: "Phone",
              value: "tel",
            },
            {
              label: "Number",
              value: "number",
            },
            {
              label: "Select (dropdown)",
              value: "select",
            },
            {
              label: "Checkbox",
              value: "checkbox",
            },
            {
              label: "Radio",
              value: "radio",
            },
            {
              label: "Date",
              value: "date",
            },
            {
              label: "Time",
              value: "time",
            },
            {
              label: "Date and time",
              value: "datetime-local",
            },
            {
              label: "File",
              value: "file",
            },
            {
              label: "URL",
              value: "url",
            },
            {
              label: "Password",
              value: "password",
            },
            {
              label: "Hidden",
              value: "hidden",
            },
            {
              label: "Range",
              value: "range",
            },
            {
              label: "Color",
              value: "color",
            },
            {
              label: "Search",
              value: "search",
            },
          ],
          defaultValue: "",
        },
        {
          name: "options",
          label: "Select options",
          type: "array",
          labels: {
            singular: "Option",
            plural: "Options",
          },
          admin: {
            initCollapsed: true,
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;

              return fieldType === "select";
            },
          },
          fields: [
            {
              name: "value",
              label: "",
              type: "text",
              defaultValue: "",
              localized: true,
            },
          ],
        },
        {
          name: "multiSelect",
          label: "Multiple options are selectable",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "select";
            },
          },
        },
        {
          name: "maxNumFiles",
          label: "Maximum number of files",
          type: "number",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "file";
            },
          },
          defaultValue: 5,
          min: 1,
          max: 10,
        },
        {
          name: "maxMBs",
          label: "Maximum total size (MB)",
          type: "number",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "file";
            },
          },
          defaultValue: 25,
          min: 1,
          max: 100,
        },
        {
          name: "includeCheckboxLink",
          label: "Add checkbox link",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return fieldType === "checkbox";
            },
          },
        },
        {
          name: "checkboxLink",
          label: "Checkbox link",
          type: "group",
          admin: {
            condition: (data, siblingData) => {
              const fieldType = siblingData?.type || data?.type;
              return (
                fieldType === "checkbox" &&
                siblingData?.includeCheckboxLink === true
              );
            },
          },
          fields: [
            {
              name: "textWithLink",
              label: "Word or text with link",
              type: "text",
              defaultValue: "",
              localized: true,
            },
            ...getLinkFields({ excludeTextField: true, excludePages: [] }),
          ],
        },
        {
          name: "required",
          label: "Field is required to be filled in",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};
