import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  AnimatedWrapper,
  ButtonLink,
  HeadingWithIcon,
  type ButtonLinkProps,
} from "@/components";
import { HERO_VIDEO } from "@/constants";
import type { LocaleOption, RawUrl } from "@/types";
import { getCachedGlobal, getGlobal } from "@/utils/server";
import { getMediaUrlAndAlt, getUrl, processText } from "@/utils";
import HeroVideo from "./HeroVideo";
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

  // Poster (the video's first frame), art-directed per orientation
  const posterProps = {
    alt: "",
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  } as const;
  const { props: portraitPoster } = getImageProps({
    ...posterProps,
    src: HERO_VIDEO.portrait.poster,
    width: HERO_VIDEO.portrait.width,
    height: HERO_VIDEO.portrait.height,
  });
  const { props: landscapePoster } = getImageProps({
    ...posterProps,
    src: HERO_VIDEO.landscape.poster,
    width: HERO_VIDEO.landscape.width,
    height: HERO_VIDEO.landscape.height,
  });

  // First button URL
  const buttonUrl = getUrl(hero.button as RawUrl, {
    hero,
    home: null,
    blog: null,
    events: null,
    prices: null,
    schedule: null,
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
          prices: null,
          schedule: null,
          privacyPolicy: null,
          cookiePolicy: null,
          termsAndConditions: null,
        })
      : undefined;

  return (
    <section
      className={twMerge(
        "relative w-full h-screen min-h-[800px] max-h-[min(1200px,240vw)] px-8",
      )}
    >
      {/* Background poster and video container */}
      <div
        className={twMerge(
          "absolute inset-0 z-0 overflow-hidden",
          "mask-[linear-gradient(to_bottom,transparent_0%,black_30%,transparent_100%)]",
          "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,transparent_100%)]",
        )}
      >
        {/* Poster */}
        <picture>
          <source
            media="(orientation: portrait)"
            srcSet={portraitPoster.srcSet ?? portraitPoster.src}
            sizes={portraitPoster.sizes}
          />
          <img
            {...landscapePoster}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
        </picture>

        {/* Background video */}
        <HeroVideo
          className="z-1"
          landscapeSrc={HERO_VIDEO.landscape.src}
          portraitSrc={HERO_VIDEO.portrait.src}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-2 bg-dark/20" aria-hidden="true" />

      {/* Container */}
      <AnimatedWrapper
        className={twMerge(
          "z-10 relative flex flex-col justify-end items-center gap-8",
          "w-full h-full max-w-400 px-8 mx-auto pb-48 text-white",
          "de:pb-64",
        )}
        delay={0.2}
        duration={1.5}
        direction="up"
      >
        {/* Heading */}
        <HeadingWithIcon className="max-w-240 mx-auto">
          <h1 className="font-bold text-center">
            {processText(hero.heading.text)}
          </h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-120 mx-auto mb-3 text-white text-center">
          {processText(hero.paragraph.text)}
        </p>

        {/* Buttons */}
        {(buttonUrl || (hero.showButton2 && hero.button2 && button2Url)) && (
          <AnimatedWrapper
            className="flex flex-wrap items-center justify-center gap-4 w-full"
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
            className="absolute right-0 top-28 flex gap-4"
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
                  className={twMerge(
                    "flex items-center justify-center w-14 h-14",
                    "text-white bg-transparent rounded-full border-2 border-white/30",
                    "backdrop-blur-sm transition-all duration-300",
                    "hover:scale-105 hover:border-white/60 hover:bg-white/5",
                    "overflow-hidden relative",
                  )}
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {iconUrl ? (
                    <figure className="z-10 relative w-6 h-6">
                      <Image
                        className="object-contain"
                        src={iconUrl}
                        alt={iconAlt}
                        fill={true}
                        sizes="24px"
                        loading="eager"
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
