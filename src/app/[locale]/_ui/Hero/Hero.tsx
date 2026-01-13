import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
  BackgroundImage,
  ButtonLink,
  HeadingWithIcon,
  type ButtonLinkProps,
} from "@/components";
import type { LocaleOption, RawUrl } from "@/types";
import { getCachedGlobal, getGlobal } from "@/utils/server";
import { getMediaUrlAndAlt, getUrl, processText } from "@/utils";
import ScrollDownIndicator from "./ScrollDownIndicator";

const Hero = async () => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const hero = draft.isEnabled
    ? await getGlobal("hero", locale, true)
    : await getCachedGlobal("hero", locale)();

  if (!hero) {
    return null;
  }

  // First button URL
  const buttonUrl = getUrl(hero.button as RawUrl, {
    hero,
    home: null,
    blog: null,
    events: null,
    privacyPolicy: null,
    cookiePolicy: null,
    termsAndConditions: null,
  });

  // Second button URL
  const button2Url =
    hero.button2 && hero.showButton2
      ? getUrl(hero.button2 as RawUrl, {
          hero,
          home: null,
          blog: null,
          events: null,
          privacyPolicy: null,
          cookiePolicy: null,
          termsAndConditions: null,
        })
      : undefined;

  return (
    <section
      className={twMerge(
        "relative w-full h-screen min-h-200 max-h-[min(1200px,240vw)]",
      )}
    >
      {/* Background image with fade mask */}
      <BackgroundImage
        className={twMerge(
          "opacity-60 mb-64",
          "mask-[linear-gradient(to_bottom,transparent_0%,black_50%," +
            "transparent_100%)]",
          "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%," +
            "black_50%,transparent_100%)]",
        )}
        src="/assets/hero-image.webp"
        alt="Latin Flow Academy"
      />

      {/* Container */}
      <AnimatedWrapper
        className={twMerge(
          "z-10 relative flex flex-col justify-end items-center gap-8",
          "w-full h-full max-w-400 px-8 mx-auto pb-48 text-white",
          "de:items-start de:w-11/12",
        )}
        delay={0.2}
        duration={1.5}
        direction="up"
      >
        {/* Heading */}
        <HeadingWithIcon className="w-full">
          <h1 className="font-bold">{processText(hero.heading.text)}</h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-120 text-white mr-auto de:mr-0">
          {processText(hero.paragraph.text)}
        </p>

        {/* Buttons */}
        {(buttonUrl || (hero.showButton2 && hero.button2 && button2Url)) && (
          <AnimatedWrapper
            className={twMerge(
              "flex flex-wrap items-start justify-start gap-4 w-full",
            )}
            delay={0.4}
            duration={1.5}
            direction="up"
          >
            {/* First button */}
            {buttonUrl && (
              <ButtonLink
                variant={hero.button.variant as ButtonLinkProps["variant"]}
                href={buttonUrl}
                target={hero.button.newTab === true ? "_blank" : "_self"}
              >
                {hero.button.text}
              </ButtonLink>
            )}

            {/* Second button */}
            {hero.showButton2 && hero.button2 && button2Url && (
              <ButtonLink
                variant={hero.button2.variant as ButtonLinkProps["variant"]}
                href={button2Url}
                target={hero.button2.newTab === true ? "_blank" : "_self"}
              >
                {hero.button2.text}
              </ButtonLink>
            )}
          </AnimatedWrapper>
        )}

        {/* Social media links */}
        {hero.socialMediaLinks.length > 0 && (
          <AnimatedWrapper
            className={twMerge(
              "absolute right-8 top-28 flex gap-4",
              "de:right-0 de:bottom-48 de:top-auto",
            )}
            delay={0.6}
            duration={1.5}
            direction="left"
          >
            {hero.socialMediaLinks.map((item, index) => {
              const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
                item.icon,
              );

              return (
                <Link
                  key={index}
                  className={twMerge(
                    "flex items-center justify-center w-14 h-14",
                    "text-white bg-transparent rounded-full border-2 border-white/30",
                    "backdrop-blur-sm transition-all duration-300",
                    "hover:scale-105 hover:border-white/60 hover:bg-white/5",
                    "overflow-hidden relative",
                  )}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {iconUrl ? (
                    <figure className="relative w-6 h-6 z-10">
                      <Image
                        className="object-contain"
                        src={iconUrl}
                        alt={iconAlt || `Social media link ${index + 1}`}
                        fill={true}
                      />
                    </figure>
                  ) : null}
                </Link>
              );
            })}
          </AnimatedWrapper>
        )}

        {/* Scroll down indicator */}
        <AnimatedWrapper
          className={twMerge(
            "absolute bottom-20 left-1/2 -translate-x-1/2",
            "de:bottom-16",
          )}
          delay={0.8}
          duration={1.5}
          direction="up"
        >
          <ScrollDownIndicator />
        </AnimatedWrapper>
      </AnimatedWrapper>
    </section>
  );
};

export default Hero;
