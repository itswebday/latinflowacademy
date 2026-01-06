"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { NavLink } from "@/components";
import { useNavMenu, usePage } from "@/contexts";
import type { LocaleOption } from "@/types";
import { request } from "@/utils";

type TranslateButtonProps = {
  className?: string;
};

const TranslateButton: React.FC<TranslateButtonProps> = ({ className }) => {
  const currentLocale = useLocale() as LocaleOption;
  const generalT = useTranslations("general");
  const { currentPage, currentPageSlug } = usePage();
  const navMenu = useNavMenu();
  const [translatedUrls, setTranslatedUrls] = useState<Record<
    LocaleOption,
    string
  > | null>(null);

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    const fetchTranslatedUrls = async () => {
      try {
        await request<{
          localizedUrls: Record<LocaleOption, string>;
          status: number;
        }>("GET", "/api/localized-routes", currentLocale, {
          searchParams: {
            currentPage: currentPage,
            currentPageSlug: currentPageSlug,
          },
          defaultErrorMessage: generalT("errors.localizedUrls"),
          setData: (data) => {
            if (data) {
              setTranslatedUrls(data.localizedUrls);
            }
          },
        });
      } catch {
        setTranslatedUrls(null);
      }
    };

    fetchTranslatedUrls();
  }, [currentPage, currentPageSlug, currentLocale, generalT]);

  return (
    <div className={twMerge(className)}>
      <div
        className={twMerge(
          "opacity-0 animate-fade-in",
          "xl:opacity-100 xl:animate-none",
          navMenu.isOpen ? "flex" : "hidden xl:flex",
        )}
      >
        {/* Language options */}
        {LOCALES.map((locale, index) => {
          const isActive = locale === currentLocale;
          const href = isActive
            ? undefined
            : translatedUrls?.[locale] ||
              (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);

          return (
            <div className="flex items-center h-full uppercase" key={index}>
              {/* Option */}
              {isActive ? (
                <div className="px-nav-link text-[11px] text-primary">
                  {locale}
                </div>
              ) : (
                <NavLink className="h-full text-[11px]" href={href || "#"}>
                  {locale}
                </NavLink>
              )}

              {/* Separating dot */}
              {index !== LOCALES.length - 1 && (
                <div className="w-[3px] h-[3px] bg-white rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranslateButton;
