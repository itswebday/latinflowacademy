import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
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

  // Parse Vimeo embed code
  const parseVimeoEmbed = (embedCode: string | null | undefined) => {
    if (!embedCode) {
      return null;
    }

    // Decode HTML entities (e.g., &amp; -> &)
    const decodedCode = embedCode
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    // Extract iframe src using regex (more flexible pattern)
    const iframeSrcMatch = decodedCode.match(/src=["']([^"']+)["']/);
    let iframeSrc = iframeSrcMatch ? iframeSrcMatch[1] : null;

    if (!iframeSrc) {
      return null;
    }

    // Extract title
    const titleMatch = decodedCode.match(/title=["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : "Latin Flow Academy Hero";

    // Extract allow attribute
    const allowMatch = decodedCode.match(/allow=["']([^"']+)["']/);
    const allow = allowMatch
      ? allowMatch[1]
      : "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";

    // Extract referrerPolicy
    const referrerPolicyMatch = decodedCode.match(
      /referrerpolicy=["']([^"']+)["']/i,
    );
    const referrerPolicy = referrerPolicyMatch
      ? referrerPolicyMatch[1]
      : "strict-origin-when-cross-origin";

    // Add background video parameters to src
    try {
      const url = new URL(iframeSrc);
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("muted", "1");
      url.searchParams.set("loop", "1");
      url.searchParams.set("background", "1");

      return {
        src: url.toString(),
        title,
        allow,
        referrerPolicy,
      };
    } catch (error) {
      // If URL parsing fails, return null
      console.error("Failed to parse Vimeo URL:", error);
      return null;
    }
  };

  const background = (
    hero as {
      background?: { vimeoEmbedCode?: string | null; firstFrame?: unknown };
    }
  ).background;

  // Parse Vimeo embed code, or use fallback if not set
  let vimeoData = parseVimeoEmbed(background?.vimeoEmbedCode);
  if (!vimeoData && !background?.vimeoEmbedCode) {
    // Fallback to hardcoded video if background field is not set
    vimeoData = {
      src: "https://player.vimeo.com/video/1157690323?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1",
      title: "Latin Flow Academy Hero",
      allow:
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
      referrerPolicy: "strict-origin-when-cross-origin" as const,
    };
  }
  const { url: firstFrameUrl, alt: firstFrameAlt } = background?.firstFrame
    ? getMediaUrlAndAlt(background.firstFrame)
    : { url: "/assets/hero-image.webp", alt: "Latin Flow Academy" };

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
        "relative w-full h-screen min-h-[800px] max-h-[min(1200px,240vw)] px-8",
      )}
    >
      {/* Background image and video container */}
      <div
        className={twMerge(
          "absolute inset-0 z-0 overflow-hidden",
          "mask-[linear-gradient(to_bottom,transparent_0%,black_30%,transparent_100%)]",
          "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,transparent_100%)]",
        )}
      >
        {/* Background image */}
        {firstFrameUrl && (
          <BackgroundImage src={firstFrameUrl} alt={firstFrameAlt} />
        )}

        {/* Background Vimeo video */}
        {vimeoData && (
          <div className="z-1 absolute inset-0 overflow-hidden">
            <iframe
              className={twMerge(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-[180vh] min-w-[calc(800px*1.8)] h-full",
              )}
              allow={vimeoData.allow}
              referrerPolicy={
                vimeoData.referrerPolicy as "strict-origin-when-cross-origin"
              }
              src={vimeoData.src}
              title={vimeoData.title}
            />
          </div>
        )}
      </div>
      <Script
        src="https://player.vimeo.com/api/player.js"
        strategy="afterInteractive"
      />

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
