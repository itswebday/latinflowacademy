"use server";

import { draftMode } from "next/headers";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { LogoLink, TranslateButton } from "@/components";
import type { LocaleOption, NavigationLink, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getUrl } from "@/utils";
import { getCachedGlobal, getCachedGlobals, getGlobal } from "@/utils/server";
import HamburgerButton from "./HamburgerButton";
import NavBar from "./NavBar";
import NavMenu from "./NavMenu";

type NavBarNavMenuProps = {
  className?: string;
};

const NavBarNavMenu: React.FC<NavBarNavMenuProps> = async ({ className }) => {
  const draft = await draftMode();
  const locale = (await getLocale()) as LocaleOption;
  const [navigation, globals] = await Promise.all([
    draft.isEnabled
      ? await getGlobal("navigation", locale, true)
      : await getCachedGlobal("navigation", locale)(),
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
    showOnNewsPage: link.showOnNewsPage || false,
    showOnDanceStylesPage: link.showOnDanceStylesPage || false,
    showOnTeachersPage: link.showOnTeachersPage || false,
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
        "z-50 absolute left-0 top-(--height-news-marquee) flex justify-between",
        "items-center uppercase w-full h-nav-bar bg-gray xl:gap-5",
        className,
      )}
    >
      {/* Logo */}
      <LogoLink className="relative w-28 ml-4" src={logoUrl} alt={logoAlt} />

      {/* Links for desktop screens */}
      <NavBar
        className="hidden items-center justify-between h-full ml-auto xl:flex"
        links={links}
      />

      {/* Translate button for desktop screens */}
      <TranslateButton className="hidden relative h-full pr-nav-link xl:flex" />

      {/* Hamburger button for mobile screens */}
      <HamburgerButton className="ml-auto" />

      {/* Sliding menu for mobile screens */}
      <NavMenu
        className={twMerge(
          "flex",
          "top-[calc(var(--height-nav-bar)+var(--height-news-marquee))]",
          "xl:hidden",
        )}
        links={links}
        slideOutMenu={navigation?.slideOutMenu || false}
      />

      {/* Translate button for mobile screens */}
      <TranslateButton
        className={twMerge(
          "z-50 absolute right-8 -bottom-12 flex ml-0",
          "xl:hidden",
        )}
      />

      {/* Book now button */}
      {showButton && buttonUrl && button?.text && (
        <Link
          className={twMerge(
            "text-[13px] flex justify-center items-center",
            "w-36 h-full font-semibold bg-primary",
            "transition-opacity duration-200 hover:opacity-85",
          )}
          href={buttonUrl}
          target={button.newTab ? "_blank" : "_self"}
        >
          {button.text}
        </Link>
      )}
    </nav>
  );
};

export default NavBarNavMenu;
