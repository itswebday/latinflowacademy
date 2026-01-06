import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "@/access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: "General",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alternative text for the file (for SEO)",
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "small",
        width: 550,
      },
      {
        name: "medium",
        width: 900,
      },
      {
        name: "large",
        width: 2000,
      },
      {
        name: "openGraph",
        width: 1200,
        height: 630,
        crop: "center",
      },
    ],
  },
};
