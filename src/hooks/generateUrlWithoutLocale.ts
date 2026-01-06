import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import type { FieldHook } from "payload";

export const generateUrlWithoutLocale: FieldHook = ({ data }) => {
  if (!data?.url || typeof data?.url !== "string") {
    return "";
  }

  const url = data.url;

  for (const loc of LOCALES) {
    if (loc !== DEFAULT_LOCALE && url.startsWith(`/${loc}/`)) {
      return url.slice(`/${loc}`.length);
    }

    if (loc !== DEFAULT_LOCALE && url === `/${loc}`) {
      return "/";
    }
  }

  return url;
};
