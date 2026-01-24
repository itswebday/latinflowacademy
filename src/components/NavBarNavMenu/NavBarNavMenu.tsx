"use server";

import HamburgerButton from "./HamburgerButton";
import NavBar from "./NavBar";
import NavMenu from "./NavMenu";
import {
  ButtonLink,
  type ButtonLinkProps,
  LogoLink,
  TranslateButton,
} from "@/components";
import type { LocaleOption, NavigationLink, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getUrl } from "@/utils";
import { getCachedGlobal, getCachedGlobals } from "@/utils/server";
import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";

type NavBarNavMenuProps = {
  className?: string;
};

const NavBarNavMenu: React.FC<NavBarNavMenuProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [navigation, globals] = await Promise.all([
    getCachedGlobal("navigation", locale)(),
    getCachedGlobals(locale)(),
  ]);
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(navigation?.logo);
  const links = (navigation?.links || []).map((link) => ({
    text: link.text || "",
    href: getUrl(link as RawUrl, globals),
    dropdown: link.dropdown || false,
    clickable: link.clickable || false,
    newTab: link.newTab || false,
    subLinks: (link.sublinks || []).map((sublink) => ({
      text: sublink.text || "",
      href: getUrl(sublink as RawUrl, globals),
      newTab: sublink.newTab || false,
    })),
    showOnEveryPage: link.showOnEveryPage || false,
    showOnHomePage: link.showOnHomePage || false,
    showOnBlogPage: link.showOnBlogPage || false,
    showOnEventsPage: link.showOnEventsPage || false,
    showOnLegalPages: link.showOnLegalPages || false,
    pageSlugs: (link.pages || []).map((page) => {
      if (typeof page === "object" && page !== null && "slug" in page) {
        return page.slug || "";
      }
      return "";
    }),
  })) as NavigationLink[];

  // Get button data from navigation
  const showButton = navigation?.showButton;
  const button = navigation?.button;
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;

  return (
    <nav
      id="top"
      className={twMerge(
        "z-95 absolute left-0 top-0 w-full h-nav-bar px-8 fade-in-0s",
        className,
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "relative flex justify-between items-center gap-4",
          "w-full max-w-400 h-full mx-auto",
        )}
      >
        {/* Logo */}
        <LogoLink
          className="z-95 w-30 shrink-0 xs:w-40"
          src={logoUrl}
          alt={logoAlt}
        />

        {/* Right sixl: NavBar, Button, Translate, Hamburger */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Navigation bar (desktop) */}
          <NavBar className="hidden xl:flex" links={links} />

          {/* Button (desktop) */}
          {showButton && buttonUrl && button?.text && (
            <div className="hidden xl:block">
              <ButtonLink
                href={buttonUrl}
                target={button.newTab ? "_blank" : "_self"}
                variant={button.variant as ButtonLinkProps["variant"]}
              >
                {button.text}
              </ButtonLink>
            </div>
          )}

          {/* Translate button */}
          <TranslateButton className="z-95 shrink-0" />

          {/* Hamburger button (mobile) */}
          <HamburgerButton className="z-95 flex xl:hidden shrink-0" />
        </div>

        {/* Navigation menu (mobile) */}
        <NavMenu
          className="flex xl:hidden"
          links={links}
          slideOutMenu={navigation?.slideOutMenu || false}
          button={
            showButton && buttonUrl && button?.text
              ? {
                  text: button.text,
                  href: buttonUrl,
                  variant: button.variant as ButtonLinkProps["variant"],
                  newTab: button.newTab || false,
                }
              : undefined
          }
        />
      </div>
    </nav>
  );
};

export default NavBarNavMenu;
