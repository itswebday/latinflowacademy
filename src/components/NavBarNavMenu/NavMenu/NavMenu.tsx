"use client";

import { useEffect, useRef } from "react";
import { NavLink } from "@/components";
import { useNavMenu, usePage } from "@/contexts";
import type { NavigationLink } from "@/types";

type NavMenuProps = {
  className?: string;
  links: NavigationLink[];
  slideOutMenu?: boolean;
};

const NavMenu: React.FC<NavMenuProps> = ({ className, links }) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const navMenu = useNavMenu();
  const { currentPage, currentPageSlug } = usePage();

  useEffect(() => {
    if (navMenu.isOpening && scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [navMenu.isOpening]);

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
    <>
      {/* Sliding navigation menu */}
      <div
        className={`
          z-40 fixed left-0 inset-y-0 w-full px-8
          bg-dark transition-transform duration-500
          xs:left-auto xs:right-0 xs:w-[550px]
          ${navMenu.isOpen ? "" : "translate-x-full"}
          ${className}
        `}
      >
        {/* Links */}
        <div
          className={`
            flex flex-col w-full h-full pt-[72px] pb-[256px] overflow-y-scroll
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          `}
          ref={scrollableRef}
        >
          {/* Navigation links */}
          {filteredLinks.map((link, index) => (
            <div
              className={`
                flex flex-col text-nowrap
                ${link.subLinks.length > 0 ? "mb-3" : ""}
              `}
              key={index}
            >
              {/* Heading or main link */}
              {link.subLinks.length > 0 && !link.clickable ? (
                <>
                  {/* Heading when not clickable */}
                  <p className="text-[18px] text-white ml-3">{link.text}</p>
                </>
              ) : (
                <>
                  {/* Main link when clickable */}
                  <NavLink
                    className="text-[18px] h-full"
                    href={link.href}
                    onClick={navMenu.close}
                  >
                    {link.text}
                  </NavLink>
                </>
              )}

              {/* Sublinks */}
              <div className="text-[13px] flex flex-col px-4 py-3">
                {link.subLinks.map((sublink, subIndex) => (
                  <NavLink
                    className="h-full py-2"
                    key={subIndex}
                    href={sublink.href}
                    target={sublink.newTab ? "_blank" : "_self"}
                    onClick={navMenu.close}
                  >
                    {sublink.text}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay to close the navigation menu */}
      <div
        className={`
          z-30 fixed inset-0 bg-black opacity-0 animate-fade-in-half
          top-[calc(var(--height-nav-bar)+var(--height-news-summary))]
          xl:hidden
          ${navMenu.isOpen ? "" : "hidden"}
        `}
        onClick={navMenu.close}
      />
    </>
  );
};

export default NavMenu;
