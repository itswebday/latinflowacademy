"use client";

import { motion } from "framer-motion";
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

    // Show on events page
    if (currentPage === "events" && link.showOnEventsPage) {
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
    <motion.div
      className={twMerge("flex items-center gap-8 h-full", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Links */}
      {filteredLinks.map((link, index) => {
        if ((link.subLinks || []).length === 0) {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {/* Link */}
              <NavLink
                href={link.href}
                target={link.newTab ? "_blank" : "_self"}
              >
                <span
                  className={twMerge(
                    "relative text-[15px] font-semibold",
                    "text-white/90 transition-all duration-300",
                    "hover:text-primary hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
                  )}
                >
                  {link.text}
                </span>
              </NavLink>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          >
            <NavBarDropdownLink
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
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default NavBar;
