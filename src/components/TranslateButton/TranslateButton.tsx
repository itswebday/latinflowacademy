"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
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
  const { isOpen: isNavMenuOpen } = useNavMenu();
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
    <div
      className={twMerge(
        "flex items-center justify-center rounded-full",
        "bg-transparent border-2 border-white/30",
        "backdrop-blur-sm transition-all duration-300",
        "hover:scale-105 hover:border-white/60 hover:bg-white/5",
        "overflow-hidden relative p-1",
        className,
      )}
    >
      {/* Locales */}
      {LOCALES.map((locale, index) => {
        const isActive = locale === currentLocale;
        const href = isActive
          ? undefined
          : translatedUrls?.[locale] ||
            (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);

        return (
          <div key={locale} className="flex items-center">
            {isActive ? (
              <span
                className={twMerge(
                  "px-4 py-1.5 text-[11px] text-white font-bold uppercase",
                  "rounded-full bg-white/10 transition-all duration-300",
                )}
              >
                {locale}
              </span>
            ) : (
              <Link
                className={twMerge(
                  "px-4 py-1.5 text-[11px] text-white/80 font-semibold",
                  "uppercase rounded-full transition-all duration-300 hover:text-white",
                )}
                href={href || "#"}
                prefetch={true}
              >
                {locale}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TranslateButton;
