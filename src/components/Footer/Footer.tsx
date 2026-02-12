"use server";

import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { LogoLink } from "@/components";
import { EmailIcon, LocationIcon, WhatsAppIcon } from "@/components/icons";
import type { Footer as FooterGlobal } from "@/payload-types";
import type { LocaleOption, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getUrl, processText } from "@/utils";
import { getCachedGlobal, getCachedGlobals, getGlobal } from "@/utils/server";
import FooterLink from "./FooterLink";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = async ({ className }) => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const [footerT, homeT, globals] = await Promise.all([
    getTranslations("footer"),
    getTranslations("home"),
    getCachedGlobals(locale)(),
  ]);
  const footer = ((globals as typeof globals & { footer?: unknown }).footer ??
    (draft.isEnabled
      ? await getGlobal("footer", locale, true)
      : await getCachedGlobal("footer", locale)())) as unknown as FooterGlobal;
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(footer.logo);

  return (
    <footer
      id="footer"
      className={twMerge("relative w-full pt-80 pb-8", "sm:pb-12", className)}
    >
      {/* Wavy line */}
      <svg
        className="z-0 absolute top-0 left-0 right-0 w-full h-100 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,80 Q300,50 600,80 Q900,110 1200,80"
          fill="none"
          stroke="#ec4899"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-8 w-5/6 max-w-7xl mx-auto",
          "xl:gap-12",
        )}
      >
        {/* Top section */}
        <div
          className={twMerge(
            "relative flex flex-col gap-16",
            "sm:grid sm:grid-cols-2",
            "xl:flex xl:flex-row xl:items-start xl:justify-between",
          )}
        >
          {/* Logo and paragraph */}
          <div
            className={twMerge(
              "flex flex-col gap-8",
              "xl:justify-between xl:shrink-0",
            )}
          >
            <div
              className={twMerge(
                "flex flex-col gap-8 items-center",
                "sm:items-start",
              )}
            >
              {/* Logo */}
              <div className="relative w-48">
                <LogoLink
                  className="h-full w-full"
                  src={logoUrl}
                  alt={logoAlt}
                />
              </div>

              {/* Paragraph */}
              {footer.Paragraph && (
                <p
                  className={twMerge(
                    "max-w-100 leading-relaxed text-center opacity-80",
                    "font-montserrat text-[15px]",
                    "sm:text-left",
                  )}
                >
                  {processText(footer.Paragraph)}
                </p>
              )}
            </div>

            {/* Social media links - shown on small screens, hidden on xl: */}
            {footer.socialMediaLinks.length > 0 && (
              <div
                className={twMerge(
                  "flex flex-col gap-5 items-center w-full mt-8",
                  "sm:items-start sm:mt-12",
                  "xl:hidden",
                )}
              >
                {/* Heading */}
                <h6
                  className={twMerge(
                    "font-bold text-center w-full opacity-80",
                    "sm:text-left",
                  )}
                >
                  {footerT("socialMedia.heading")}
                </h6>

                {/* Links */}
                <div
                  className={twMerge(
                    "flex gap-4 items-center justify-center w-full",
                    "sm:justify-start",
                  )}
                >
                  {footer.socialMediaLinks.map((item, index) => {
                    const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
                      item.icon,
                    );

                    return (
                      <Link
                        className={twMerge(
                          "group relative flex items-center justify-center",
                          "p-3 rounded-full shrink-0",
                          "bg-linear-to-br from-primary to-secondary",
                          "shadow-lg shadow-primary/40",
                          "border-2 border-primary/30",
                          "transition-all duration-300 ease-out",
                          "hover:scale-110 hover:shadow-xl hover:shadow-primary/50",
                          "hover:border-primary/50",
                          "active:scale-105",
                          "de:p-4",
                        )}
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Glow effect */}
                        <span
                          className={twMerge(
                            "absolute inset-0 rounded-full",
                            "bg-linear-to-br from-primary/40 to-secondary/40",
                            "opacity-0 transition-opacity duration-300",
                            "group-hover:opacity-100 blur-md -z-10",
                          )}
                        />

                        {/* Icon */}
                        {iconUrl ? (
                          <span className="relative z-10 block w-6 h-6 de:w-7 de:h-7">
                            <Image
                              className="object-contain transition-transform duration-300 group-hover:scale-110 brightness-0 invert"
                              src={iconUrl}
                              alt={iconAlt}
                              fill={true}
                              sizes="28px"
                            />
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Legal links - shown on xl: screens */}
            {footer.legalLinks.length > 0 && (
              <div
                className={twMerge(
                  "absolute bottom-0 left-0 flex flex-col gap-2",
                  "hidden xl:flex",
                )}
              >
                {footer.legalLinks.map((link, index) => {
                  const linkUrl = getUrl(link as RawUrl, globals);

                  if (!linkUrl) {
                    return null;
                  }

                  return (
                    <FooterLink
                      key={index}
                      href={linkUrl}
                      target={link.newTab ? "_blank" : "_self"}
                    >
                      <span className="opacity-80">{link.text}</span>
                    </FooterLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact information */}
          <div
            className={twMerge(
              "flex flex-col gap-4",
              "sm:w-fit sm:ml-auto",
              "xl:w-auto xl:mx-0",
              "xl:gap-6 xl:col-span-4 xl:col-start-5",
            )}
          >
            <div className="flex flex-col gap-4 xl:gap-6">
              {/* WhatsApp */}
              {footer.phone.text && (
                <FooterLink
                  className="flex items-center gap-3 xl:gap-4"
                  href={`https://wa.me/${footer.phone.text.replace(/\D/g, "")}`}
                  target="_blank"
                >
                  {/* Icon */}
                  <figure
                    className={twMerge(
                      "group relative p-3 rounded-full shrink-0",
                      "bg-linear-to-br from-primary to-secondary",
                      "shadow-lg shadow-primary/40",
                      "border-2 border-primary/30",
                      "transition-all duration-300 ease-out",
                      "hover:scale-110 hover:shadow-xl hover:shadow-primary/50",
                      "hover:border-primary/50",
                      "active:scale-105",
                      "de:p-4",
                    )}
                  >
                    {/* Glow effect */}
                    <span
                      className={twMerge(
                        "absolute inset-0 rounded-full",
                        "bg-linear-to-br from-primary/40 to-secondary/40",
                        "opacity-0 transition-opacity duration-300",
                        "group-hover:opacity-100 blur-md -z-10",
                      )}
                    />

                    <WhatsAppIcon
                      className={twMerge(
                        "relative z-10 w-6 h-6 shrink-0 text-white",
                        "transition-transform duration-300",
                        "group-hover:scale-110",
                        "de:w-7 de:h-7",
                      )}
                    />
                  </figure>

                  {/* Text */}
                  <span className="opacity-80 font-montserrat text-[15px]">
                    {footer.phone.text}
                  </span>
                </FooterLink>
              )}

              {/* Email */}
              {footer.email.text && (
                <FooterLink
                  className="flex items-center gap-3 xl:gap-4"
                  href={`mailto:${footer.email.text}`}
                  target="_blank"
                >
                  {/* Icon */}
                  <figure
                    className={twMerge(
                      "group relative p-3 rounded-full shrink-0",
                      "bg-linear-to-br from-primary to-secondary",
                      "shadow-lg shadow-primary/40",
                      "border-2 border-primary/30",
                      "transition-all duration-300 ease-out",
                      "hover:scale-110 hover:shadow-xl hover:shadow-primary/50",
                      "hover:border-primary/50",
                      "active:scale-105",
                      "de:p-4",
                    )}
                  >
                    {/* Glow effect */}
                    <span
                      className={twMerge(
                        "absolute inset-0 rounded-full",
                        "bg-linear-to-br from-primary/40 to-secondary/40",
                        "opacity-0 transition-opacity duration-300",
                        "group-hover:opacity-100 blur-md -z-10",
                      )}
                    />

                    <EmailIcon
                      className={twMerge(
                        "relative z-10 w-6 h-6 shrink-0 text-white",
                        "transition-transform duration-300",
                        "group-hover:scale-110",
                        "de:w-7 de:h-7",
                      )}
                    />
                  </figure>

                  {/* Text */}
                  <span className="opacity-80 font-montserrat text-[15px]">
                    {footer.email.text}
                  </span>
                </FooterLink>
              )}

              {/* Address */}
              {footer.address.line1 && (
                <FooterLink
                  className="flex items-center gap-3 xl:gap-4"
                  href={footer.address.url}
                  target="_blank"
                >
                  {/* Icon */}
                  <figure
                    aria-hidden
                    className={twMerge(
                      "relative p-3 rounded-full shrink-0",
                      "bg-linear-to-br from-primary to-secondary",
                      "shadow-lg shadow-primary/40",
                      "border-2 border-primary/30",
                      "de:p-4",
                    )}
                  >
                    <LocationIcon
                      className={twMerge(
                        "relative z-10 w-6 h-6 shrink-0 text-white",
                        "de:w-7 de:h-7",
                      )}
                    />
                  </figure>
                  {/* Text */}
                  <div className="flex flex-col gap-0.5 justify-start">
                    {footer.address.line1 && (
                      <span className="w-full whitespace-nowrap opacity-80 font-montserrat text-[15px]">
                        {footer.address.line1}
                      </span>
                    )}
                    {footer.address.line2 && (
                      <span className="w-full whitespace-nowrap opacity-80 font-montserrat text-[15px]">
                        {footer.address.line2}
                        {footer.address.line3 && <>, {footer.address.line3}</>}
                      </span>
                    )}
                  </div>
                </FooterLink>
              )}
            </div>
          </div>

          {/* Social media and opening hours */}
          <div
            className={twMerge(
              "flex flex-col gap-16",
              "sm:grid sm:grid-cols-2 sm:col-span-2",
              "xl:flex xl:flex-col xl:col-span-4 xl:w-fit xl:items-end",
              "xl:shrink-0",
            )}
          >
            {/* Opening hours and legal links container for small screens */}
            <div
              className={twMerge(
                "flex flex-row justify-between items-start gap-4 w-full",
                "xl:hidden",
              )}
            >
              {/* Opening hours */}
              {footer.openingHours && footer.openingHours.length > 0 && (
                <div className="flex flex-col gap-3 items-start">
                  {/* Heading */}
                  <h6 className="font-bold opacity-80">
                    {footerT("openingHours.heading")}
                  </h6>

                  {/* Lines */}
                  <div className="flex flex-col gap-2">
                    {footer.openingHours.map((item, index) => {
                      if (!item.text) {
                        return null;
                      }

                      return (
                        <span
                          key={index}
                          className="font-montserrat text-[15px] opacity-80"
                        >
                          {item.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legal links - shown on small screens, hidden on xl: */}
              {footer.legalLinks.length > 0 && (
                <div
                  className={twMerge(
                    "flex flex-col gap-3 items-end self-end text-right",
                    "sm:absolute sm:bottom-0 sm:right-0",
                  )}
                >
                  {footer.legalLinks.map((link, index) => {
                    const linkUrl = getUrl(link as RawUrl, globals);

                    if (!linkUrl) {
                      return null;
                    }

                    return (
                      <FooterLink
                        key={index}
                        href={linkUrl}
                        target={link.newTab ? "_blank" : "_self"}
                      >
                        <span className="text-[13px] opacity-80">
                          {link.text}
                        </span>
                      </FooterLink>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Social media links - shown on xl: screens */}
            {footer.socialMediaLinks.length > 0 && (
              <div
                className={twMerge(
                  "hidden flex-col gap-5",
                  "xl:flex xl:w-full xl:items-center",
                )}
              >
                {/* Heading */}
                <h6 className="font-bold opacity-80 text-center">
                  {footerT("socialMedia.heading")}
                </h6>

                {/* Links */}
                <div className="flex gap-4 xl:justify-center">
                  {footer.socialMediaLinks.map((item, index) => {
                    const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
                      item.icon,
                    );

                    return (
                      <Link
                        className={twMerge(
                          "group relative flex items-center justify-center",
                          "p-3 rounded-full shrink-0",
                          "bg-linear-to-br from-primary to-secondary",
                          "shadow-lg shadow-primary/40",
                          "border-2 border-primary/30",
                          "transition-all duration-300 ease-out",
                          "hover:scale-110 hover:shadow-xl hover:shadow-primary/50",
                          "hover:border-primary/50",
                          "active:scale-105",
                          "de:p-4",
                        )}
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Glow effect */}
                        <span
                          className={twMerge(
                            "absolute inset-0 rounded-full",
                            "bg-linear-to-br from-primary/40 to-secondary/40",
                            "opacity-0 transition-opacity duration-300",
                            "group-hover:opacity-100 blur-md -z-10",
                          )}
                        />

                        {/* Icon */}
                        {iconUrl ? (
                          <span className="relative z-10 block w-6 h-6 de:w-7 de:h-7">
                            <Image
                              className="object-contain transition-transform duration-300 group-hover:scale-110 brightness-0 invert"
                              src={iconUrl}
                              alt={iconAlt}
                              fill={true}
                              sizes="28px"
                            />
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opening hours - shown on xl: screens */}
            {footer.openingHours && footer.openingHours.length > 0 && (
              <div
                className={twMerge(
                  "hidden flex-col gap-2",
                  "xl:flex xl:w-full xl:items-end",
                )}
              >
                {/* Heading */}
                <h6 className="font-bold opacity-80 text-right">
                  {footerT("openingHours.heading")}
                </h6>

                {/* Lines */}
                <div className="flex flex-col gap-2">
                  {footer.openingHours.map((item, index) => {
                    if (!item.text) {
                      return null;
                    }

                    return (
                      <span
                        className="w-full text-[15px] text-right font-montserrat opacity-80"
                        key={index}
                      >
                        {item.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div
        className={twMerge(
          "w-5/6 max-w-7xl mx-auto mt-8 pt-8",
          "border-t border-dark/20",
        )}
      >
        {/* Copyright and company details */}
        <div
          className={twMerge(
            "flex flex-col gap-6 items-center",
            "sm:flex-row sm:justify-between sm:items-start",
          )}
        >
          {/* Copyright */}
          <div className="text-[13px] text-center opacity-80 sm:text-left">
            <span className="flex items-center gap-1 mb-1">
              © {new Date().getFullYear()}
              <FooterLink className="font-semibold" href={homeT("url")}>
                Latin Flow Academy
              </FooterLink>
            </span>{" "}
            All rights reserved.
          </div>

          {/* Company details */}
          {(footer.companyDetails.crn || footer.companyDetails.vat) && (
            <div
              className={twMerge(
                "flex flex-col gap-2 items-center",
                "sm:flex-row sm:gap-6 sm:items-start",
              )}
            >
              {footer.companyDetails.crn && (
                <span className="text-[13px] opacity-80">
                  {footerT("legalLinks.crn")}:{" "}
                  <span className="font-semibold opacity-80">
                    {footer.companyDetails.crn}
                  </span>
                </span>
              )}
              {footer.companyDetails.vat && (
                <span className="text-[13px] opacity-80">
                  {footerT("legalLinks.vat")}:{" "}
                  <span className="font-semibold opacity-80">
                    {footer.companyDetails.vat}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
