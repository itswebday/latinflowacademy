import type { CollectionConfig } from "payload";
import { authenticated, userDelete, userUpdate } from "@/access";
import { protectRoles } from "@/hooks";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role"],
    group: "General",
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: userUpdate,
    delete: userDelete,
  },
  auth: true,
  fields: [
    {
      name: "role",
      label: "Role",
      type: "select",
      defaultValue: "admin",
      options: [
        {
          label: "Developer",
          value: "developer",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [protectRoles],
  },
};
