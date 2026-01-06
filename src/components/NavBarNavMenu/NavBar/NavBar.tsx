"use client";

import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import { usePage } from "@/contexts";
import type { NavigationLink } from "@/types";
import NavBarDropdownLink from "./NavBarDropdownLink";

type NavBarProps = {
  className?: string;
  links: NavigationLink[];
};

const NavBar: React.FC<NavBarProps> = ({ className, links }) => {
  const { currentPage, currentPageSlug } = usePage();

  // Filter links based on visibility rules
  const filteredLinks = links.filter((link) => {
    // Show on every page
    if (link.showOnEveryPage) {
      return true;
    }

    // Show on home page
    if (
      currentPage === "home" &&
      currentPageSlug === "" &&
      link.showOnHomePage
    ) {
      return true;
    }

    // Show on blog page
    if (currentPage === "blog" && link.showOnBlogPage) {
      return true;
    }

    // Show on news page
    if (currentPage === "news" && link.showOnNewsPage) {
      return true;
    }

    // Show on dance styles page
    if (currentPage === "danceStyles" && link.showOnDanceStylesPage) {
      return true;
    }

    // Show on teachers page
    if (currentPage === "teachers" && link.showOnTeachersPage) {
      return true;
    }

    // Show on legal pages
    if (
      (currentPage === "privacy-policy" ||
        currentPage === "cookie-policy" ||
        currentPage === "terms-and-conditions") &&
      link.showOnLegalPages
    ) {
      return true;
    }

    // Show on specific pages
    if (currentPageSlug && link.pageSlugs && link.pageSlugs.length > 0) {
      return link.pageSlugs.includes(currentPageSlug);
    }

    return false;
  });

  return (
    <div className={twMerge("flex items-center gap-3 h-full", className)}>
      {/* Links */}
      {filteredLinks.map((link, index) => {
        if ((link.subLinks || []).length === 0) {
          return (
            <NavLink
              key={index}
              className="text-[13px] h-full"
              href={link.href}
              target={link.newTab ? "_blank" : "_self"}
            >
              {link.text}
            </NavLink>
          );
        }

        return (
          <NavBarDropdownLink
            key={index}
            className="text-[14px]"
            text={link.text}
            href={link.clickable ? link.href : undefined}
            newTab={link.newTab}
            subLinks={link.subLinks.map((subLink) => ({
              text: subLink.text,
              href: subLink.href,
              newTab: subLink.newTab,
            }))}
            clickable={link.clickable}
          />
        );
      })}
    </div>
  );
};

export default NavBar;
