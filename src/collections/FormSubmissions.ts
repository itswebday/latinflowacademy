import type { CollectionConfig } from "payload";
import { developer } from "@/access";

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  labels: {
    singular: "Form submission",
    plural: "Form submissions",
  },
  admin: {
    useAsTitle: "form",
    defaultColumns: ["form", "submittedAt", "updatedAt"],
    group: "Content",
  },
  access: {
    create: () => true, // Allow public submissions
    read: developer,
    update: developer,
    delete: developer,
  },
  fields: [
    {
      name: "form",
      label: "Form",
      type: "relationship",
      relationTo: "forms",
      required: true,
    },
    {
      name: "submissionData",
      label: "Submission Data",
      type: "json",
      required: true,
    },
    {
      name: "uploads",
      label: "Files",
      type: "array",
      fields: [
        {
          name: "field",
          label: "Field name",
          type: "text",
          required: true,
        },
        {
          name: "files",
          label: "Files",
          type: "relationship",
          relationTo: "media",
          hasMany: true,
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: "submittedAt",
      label: "Submitted at",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === "create" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
  ],
};
