import { DEFAULT_LOCALE } from "@/constants";
import type { FieldHook } from "payload";

export const generateDanceStyleUrl: FieldHook = ({ data, req }) => {
  const slug = data?.slug;
  const locale = req?.locale || DEFAULT_LOCALE;

  if (slug) {
    if (slug && typeof slug === "string") {
      const basePath = `/dance-styles/${slug}`;

      return locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath}`;
    }
  }
  return "";
};
