import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
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
import { getMediaUrlAndAlt, getUrl, highlightText } from "@/utils";
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
  const secondButtonUrl =
    hero.secondButton && hero.showSecondButton
      ? getUrl(hero.secondButton as RawUrl, {
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
    <section className="relative w-full pb-64 bg-dark">
      {/* Background image with fade mask */}
      <BackgroundImage
        className={twMerge(
          "opacity-60 mb-64",
          "mask-[linear-gradient(to_bottom,transparent_0%,black_50%,transparent_100%)]",
          "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_50%,transparent_100%)]",
        )}
        src="/assets/hero-image.webp"
        alt="Latin Flow Academy"
      />

      {/* Abstract bottom edge */}
      <svg
        className="absolute bottom-0 left-0 right-0 z-20 w-full pointer-events-none"
        style={{ height: "160px" }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main abstract flowing edge */}
        <path
          d="M0,160 L0,30 Q150,10 300,25 Q450,40 600,20 Q750,5 900,18 Q1050,35 1200,15 L1200,160 Z"
          fill="#ffffff"
        />
        {/* Secondary flowing curve for depth */}
        <path
          d="M0,160 L0,60 Q200,45 400,50 Q600,55 800,48 Q1000,42 1200,52 L1200,160 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Accent wave */}
        <path
          d="M0,160 L0,90 C100,80 200,85 300,82 C400,79 500,86 600,83 C700,80 800,87 900,84 C1000,81 1100,88 1200,85 L1200,160 Z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>

      {/* Container */}
      <AnimatedWrapper
        className={twMerge(
          "z-10 relative flex flex-col justify-end items-center gap-8",
          "w-full max-w-400 h-screen min-h-200 max-h-[min(1200px,240vw)]",
          "px-8 pb-64 mx-auto text-white",
          "de:items-start de:min-h-200 de:w-11/12 de:px-0 de:pb-48",
        )}
        delay={0.2}
        duration={1.5}
        direction="up"
      >
        {/* Heading */}
        <HeadingWithIcon className="w-83 mr-auto de:w-142 de:mr-0">
          <h1>
            {typeof hero.heading.text === "string" && hero.heading.hlTexts
              ? highlightText(hero.heading.text, hero.heading.hlTexts)
              : hero.heading.text}
          </h1>
        </HeadingWithIcon>

        {/* Paragraph */}
        <p className="max-w-160 text-white mr-auto de:mr-0">
          {hero.paragraph.text}
        </p>

        {/* Buttons */}
        <AnimatedWrapper
          className={twMerge(
            "flex flex-col gap-4 mr-auto",
            "de:flex-row de:mr-0",
          )}
          delay={0.4}
          duration={1.5}
          direction="up"
        >
          {/* First button */}
          {buttonUrl && (
            <ButtonLink
              href={buttonUrl}
              target={hero.button.newTab === true ? "_blank" : "_self"}
              variant={hero.button.variant as ButtonLinkProps["variant"]}
            >
              {hero.button.text}
            </ButtonLink>
          )}

          {/* Second button */}
          {hero.showSecondButton && hero.secondButton && secondButtonUrl && (
            <ButtonLink
              href={secondButtonUrl}
              target={hero.secondButton.newTab === true ? "_blank" : "_self"}
              variant={hero.secondButton.variant as ButtonLinkProps["variant"]}
            >
              {hero.secondButton.text}
            </ButtonLink>
          )}
        </AnimatedWrapper>

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
                    "group relative flex items-center justify-center",
                    "w-12 h-12 rounded-full",
                    "bg-white/10 backdrop-blur-sm border border-white/20",
                    "transition-all duration-300",
                    "hover:scale-110 hover:bg-white/20 hover:border-white/40",
                    "hover:shadow-lg hover:shadow-white/20",
                  )}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {/* Icon */}
                  {iconUrl ? (
                    <span className="relative block w-6 h-6">
                      <Image
                        className="object-contain transition-opacity duration-300 group-hover:opacity-90"
                        src={iconUrl}
                        alt={iconAlt}
                        fill={true}
                        sizes="24px"
                      />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </AnimatedWrapper>
        )}

        {/* Scroll down indicator */}
        <AnimatedWrapper
          className={twMerge(
            "absolute bottom-32 left-1/2 -translate-x-1/2",
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
