import type { Config } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { unstable_cache } from "next/cache";
import { getCachedPayload } from "./payload";

type Global = keyof Config["globals"];

export const getGlobal = async <GlobalType extends Global>(
  slug: GlobalType,
  locale: LocaleOption,
  draft?: boolean,
) => {
  const payload = await getCachedPayload();
  const global = await payload.findGlobal({
    slug: slug,
    depth: 1,
    locale: locale,
    draft: draft,
    overrideAccess:
      draft ||
      [
        "hero",
        "home",
        "navigation",
        "footer",
        "blog",
        "news",
        "dance-styles",
        "teachers",
        "privacy-policy",
        "cookie-policy",
        "terms-and-conditions",
      ].includes(slug)
        ? true
        : false,
  });

  return global;
};

export const getCachedGlobal = <GlobalType extends Global>(
  slug: GlobalType,
  locale: LocaleOption,
) => {
  return unstable_cache(
    () => getGlobal<GlobalType>(slug, locale),
    [`${slug}_${locale}`],
    {
      tags: [`global_${slug}_${locale}`],
    },
  );
};

export const getGlobals = async (locale: LocaleOption, draft?: boolean) => {
  const [
    home,
    blog,
    news,
    danceStyles,
    teachers,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  ] = await Promise.all([
    getGlobal("home", locale, draft),
    getGlobal("blog", locale, draft),
    getGlobal("news", locale, draft),
    getGlobal("dance-styles", locale, draft),
    getGlobal("teachers", locale, draft),
    getGlobal("privacy-policy", locale, draft),
    getGlobal("cookie-policy", locale, draft),
    getGlobal("terms-and-conditions", locale, draft),
  ]);

  return {
    home,
    blog,
    news,
    danceStyles,
    teachers,
    privacyPolicy,
    cookiePolicy,
    termsAndConditions,
  };
};

export const getCachedGlobals = (locale: LocaleOption) => {
  return unstable_cache(() => getGlobals(locale), [`globals_${locale}`], {
    tags: [
      `global_home_${locale}`,
      `global_blog_${locale}`,
      `global_news_${locale}`,
      `global_dance-styles_${locale}`,
      `global_teachers_${locale}`,
      `global_privacy-policy_${locale}`,
      `global_cookie-policy_${locale}`,
      `global_terms-and-conditions_${locale}`,
    ],
  });
};
