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
import { getMediaUrlAndAlt, getUrl } from "@/utils";
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
      className={twMerge(
        "relative w-full pt-12 pb-8 bg-gray",
        "sm:pt-16 sm:pb-12",
        className,
      )}
    >
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
              <div className="relative w-32">
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
                    "text-[14px] leading-relaxed max-w-sm",
                    "text-white/70 text-center",
                    "sm:text-left",
                  )}
                >
                  {footer.Paragraph}
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
                    "font-bold text-center w-full opacity-80 text-white",
                    "sm:text-left",
                  )}
                >
                  {footerT("socialMedia.heading")}
                </h6>

                {/* Links */}
                <div
                  className={twMerge(
                    "flex gap-3 items-center justify-center w-full",
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
                          "flex items-center justify-center rounded-full",
                          "transition-opacity duration-200 hover:opacity-80",
                        )}
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Icon */}
                        {iconUrl ? (
                          <figure
                            className={twMerge(
                              "relative p-4 rounded-full bg-primary",
                            )}
                          >
                            <Image
                              className="w-7 h-7 object-contain"
                              src={iconUrl}
                              alt={iconAlt}
                              width={28}
                              height={28}
                              loading="eager"
                            />
                          </figure>
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
                      <span
                        className={twMerge(
                          "text-[13px] uppercase font-light",
                          "text-white opacity-80",
                        )}
                      >
                        {link.text}
                      </span>
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
                <div className="flex items-center gap-3 xl:gap-4">
                  {/* Icon */}
                  <figure
                    className={twMerge(
                      "relative p-3 rounded-full bg-primary",
                      "de:p-3.5",
                    )}
                  >
                    <WhatsAppIcon
                      className={twMerge(
                        "w-6 h-6 shrink-0 text-black",
                        "de:w-7 de:h-7",
                      )}
                    />
                  </figure>

                  {/* Text */}
                  <FooterLink
                    href={`https://wa.me/${footer.phone.text.replace(
                      /\D/g,
                      "",
                    )}`}
                    target="_blank"
                  >
                    <span
                      className={twMerge(
                        "text-[13px] uppercase",
                        "text-white font-light opacity-80",
                        "sm:text-[12px]",
                        "md:text-[13px]",
                      )}
                    >
                      {footer.phone.text}
                    </span>
                  </FooterLink>
                </div>
              )}

              {/* Email */}
              {footer.email.text && (
                <div className="flex items-center gap-3 xl:gap-4">
                  {/* Icon */}
                  <figure
                    className={twMerge(
                      "relative p-3 rounded-full bg-primary",
                      "de:p-3.5",
                    )}
                  >
                    <EmailIcon
                      className={twMerge(
                        "w-6 h-6 shrink-0 text-black",
                        "de:w-7 de:h-7",
                      )}
                    />
                  </figure>

                  {/* Text */}
                  <FooterLink
                    href={`mailto:${footer.email.text}`}
                    target="_blank"
                  >
                    <span
                      className={twMerge(
                        "text-[13px] uppercase",
                        "text-white font-light opacity-80",
                        "sm:text-[12px]",
                        "md:text-[13px]",
                      )}
                    >
                      {footer.email.text}
                    </span>
                  </FooterLink>
                </div>
              )}

              {/* Address */}
              {footer.address.line1 && (
                <div className="flex items-center gap-3 xl:gap-4">
                  {/* Icon */}
                  <figure
                    className={twMerge(
                      "relative p-3 de:p-3.5 bg-primary rounded-full shrink-0",
                    )}
                  >
                    <LocationIcon
                      className={twMerge("w-6 h-6 text-black", "de:w-7 de:h-7")}
                    />
                  </figure>

                  {/* Text */}
                  <FooterLink
                    className="flex flex-col gap-0.5 justify-start"
                    href={footer.address.url}
                    target="_blank"
                  >
                    {footer.address.line1 && (
                      <span
                        className={twMerge(
                          "w-full text-[13px] uppercase",
                          "text-white font-light whitespace-nowrap opacity-80",
                          "sm:text-[12px]",
                          "md:text-[13px]",
                        )}
                      >
                        {footer.address.line1}
                      </span>
                    )}
                    {footer.address.line2 && (
                      <span
                        className={twMerge(
                          "w-full text-[13px] uppercase",
                          "text-white font-light whitespace-nowrap opacity-80",
                          "sm:text-[12px]",
                          "md:text-[13px]",
                        )}
                      >
                        {footer.address.line2}
                      </span>
                    )}
                    {footer.address.line3 && (
                      <span
                        className={twMerge(
                          "w-full text-[13px] uppercase",
                          "text-white font-light whitespace-nowrap opacity-80",
                          "sm:text-[12px]",
                          "md:text-[13px]",
                        )}
                      >
                        {footer.address.line3}
                      </span>
                    )}
                  </FooterLink>
                </div>
              )}
            </div>
          </div>

          {/* Social media and quick links */}
          <div
            className={twMerge(
              "flex flex-col gap-16",
              "sm:grid sm:grid-cols-2 sm:col-span-2",
              "xl:flex xl:flex-col xl:col-span-4 xl:w-fit xl:items-end",
              "xl:shrink-0",
            )}
          >
            {/* Quick links and legal links container for small screens */}
            <div
              className={twMerge(
                "flex flex-row justify-between items-start gap-4 w-full",
                "xl:hidden",
              )}
            >
              {/* Quick links */}
              {footer.quickLinks.length > 0 && (
                <div className="flex flex-col gap-3 items-start">
                  {/* Links */}
                  <div className="flex flex-col gap-3">
                    {footer.quickLinks.map((link, index) => {
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
                          <span
                            className={twMerge(
                              "text-[12px] uppercase font-light",
                              "text-white",
                            )}
                          >
                            {link.text}
                          </span>
                        </FooterLink>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legal links - shown on small screens, hidden on xl: */}
              {footer.legalLinks.length > 0 && (
                <div
                  className={twMerge(
                    "flex flex-col gap-3 items-end self-end",
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
                        <span
                          className={twMerge(
                            "text-[12px] uppercase font-light",
                            "text-white opacity-80",
                          )}
                        >
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
                <h6 className="font-bold opacity-80 text-white text-center">
                  {footerT("socialMedia.heading")}
                </h6>

                {/* Links */}
                <div className="flex gap-3 xl:gap-4 xl:justify-center">
                  {footer.socialMediaLinks.map((item, index) => {
                    const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
                      item.icon,
                    );

                    return (
                      <Link
                        className={twMerge(
                          "flex items-center justify-center rounded-full",
                          "transition-opacity duration-200 hover:opacity-80",
                        )}
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Icon */}
                        {iconUrl ? (
                          <figure
                            className={twMerge(
                              "relative p-4 rounded-full bg-primary",
                            )}
                          >
                            <Image
                              className="w-7 h-7 object-contain"
                              src={iconUrl}
                              alt={iconAlt}
                              width={28}
                              height={28}
                              loading="eager"
                            />
                          </figure>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick links - shown on xl: screens */}
            {footer.quickLinks.length > 0 && (
              <div
                className={twMerge(
                  "hidden flex-col gap-2",
                  "xl:flex xl:w-full xl:items-end",
                )}
              >
                {/* Links */}
                <div className="flex flex-col gap-2">
                  {footer.quickLinks.map((link, index) => {
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
                        <span
                          className={twMerge(
                            "w-full text-[13px] text-right uppercase",
                            "font-light text-white",
                          )}
                        >
                          {link.text}
                        </span>
                      </FooterLink>
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
          "border-t border-white/20",
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
          <div
            className={twMerge(
              "text-[12px] uppercase font-light text-center",
              "text-white/70",
              "sm:text-left",
            )}
          >
            <span className="flex items-center gap-2 mb-1">
              © {new Date().getFullYear()}
              <FooterLink
                className="text-white font-medium"
                href={homeT("url")}
              >
                Euphoria Dance Academy
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
                <span className="text-[12px] text-white/70 font-light">
                  {footerT("legalLinks.crn")}:{" "}
                  <span className="font-medium text-white/90">
                    {footer.companyDetails.crn}
                  </span>
                </span>
              )}
              {footer.companyDetails.vat && (
                <span className="text-[12px] text-white/70 font-light">
                  {footerT("legalLinks.vat")}:{" "}
                  <span className="font-medium text-white/90">
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
