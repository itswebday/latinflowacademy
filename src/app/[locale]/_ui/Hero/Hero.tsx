import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { twMerge } from "tailwind-merge";
import {
  BackgroundVideo,
  ButtonLink,
  HeadingWithIcon,
  type ButtonLinkProps,
} from "@/components";
import type { LocaleOption, RawUrl } from "@/types";
import { getCachedGlobal, getGlobal } from "@/utils/server";
import { getUrl, highlightText } from "@/utils";

const Hero = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const hero = draft.isEnabled
    ? await getGlobal("hero", locale, true)
    : await getCachedGlobal("hero", locale)();

  if (!hero) {
    return null;
  }

  const buttonUrl = hero.button
    ? getUrl(hero.button as RawUrl, {
        hero,
        home: null,
        blog: null,
        news: null,
        danceStyles: null,
        teachers: null,
        privacyPolicy: null,
        cookiePolicy: null,
        termsAndConditions: null,
      })
    : undefined;

  return (
    <section
      className={twMerge(
        "relative flex items-center justify-center w-full",
        "h-[60vh] min-h-[max(100vw,480px)] max-h-[150vw] bg-dark",
        "de:h-[calc(100vh-var(--height-nav-bar)-var(--height-news-marquee))]",
        "de:min-h-[50vw] de:max-h-[max(1200px,60vw)]",
      )}
    >
      {/* Background video */}
      <BackgroundVideo
        alt="Hero video"
        src="/assets/hero-video.webm"
        type="video/webm"
      />

      {/* Container */}
      <div
        className={twMerge(
          "z-10 flex flex-col items-center gap-8",
          "w-11/12 text-center text-white",
          "de:gap-4",
        )}
      >
        {/* Heading */}
        {hero.heading && (
          <HeadingWithIcon className="justify-center w-11/12 mx-auto">
            <h1 className="font-bold text-white">
              {typeof hero.heading.text === "string" && hero.heading.hlTexts
                ? highlightText(hero.heading.text, hero.heading.hlTexts)
                : hero.heading.text}
            </h1>
          </HeadingWithIcon>
        )}

        {/* Subheading */}
        {hero.subheading && (
          <HeadingWithIcon>
            <h6 className="font-bold text-white">
              {typeof hero.subheading.text === "string" &&
              hero.subheading.hlTexts
                ? highlightText(hero.subheading.text, hero.subheading.hlTexts)
                : hero.subheading.text}
            </h6>
          </HeadingWithIcon>
        )}

        {/* Button */}
        {hero.button && buttonUrl && (
          <ButtonLink
            className="mt-4"
            href={buttonUrl}
            target={hero.button.newTab === true ? "_blank" : "_self"}
            variant={hero.button.variant as ButtonLinkProps["variant"]}
          >
            {hero.button.text}
          </ButtonLink>
        )}
      </div>
    </section>
  );
};

export default Hero;
