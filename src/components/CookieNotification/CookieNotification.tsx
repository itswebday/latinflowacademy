"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface CookieNotificationProps {
  className?: string;
}

const CookieNotification: React.FC<CookieNotificationProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cookiePolicyT = useTranslations("cookiePolicy");
  const generalT = useTranslations("general");

  useEffect(() => {
    if (!localStorage.getItem("cookieAccepted")) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieAccepted", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={twMerge(
            "z-100 fixed left-0 right-0 bottom-0",
            "bg-dark border-t border-white/10 shadow-2xl",
            "backdrop-blur-sm",
            className,
          )}
        >
          {/* Container */}
          <div
            className={twMerge(
              "flex flex-col justify-between items-start gap-6",
              "w-11/12 max-w-7xl py-6 mx-auto",
              "de:flex-row de:items-center de:gap-8",
            )}
          >
            {/* Notification */}
            <p className="flex-1 text-white/90 text-[16px] leading-relaxed">
              {generalT("cookieNotification")}{" "}
              <Link
                className={twMerge(
                  "text-primary font-semibold",
                  "transition-opacity duration-200",
                  "hover:opacity-70",
                  "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
                )}
                href={cookiePolicyT("url")}
                prefetch={true}
              >
                {generalT("cookiePolicy")}
              </Link>
              .
            </p>

            {/* Buttons */}
            <div className="flex gap-4 shrink-0">
              {/* Decline button */}
              <button
                className={twMerge(
                  "px-6 py-3 rounded-full",
                  "font-semibold text-white/80",
                  "bg-transparent border-2 border-white/30",
                  "backdrop-blur-sm",
                  "transition-all duration-300",
                  "hover:border-white/60 hover:bg-white/5 hover:text-white",
                )}
                onClick={handleDecline}
              >
                {generalT("decline")}
              </button>

              {/* Accept button */}
              <button
                className={twMerge(
                  "px-6 py-3 rounded-full",
                  "font-semibold text-white",
                  "bg-linear-to-r from-primary to-secondary",
                  "shadow-lg shadow-primary/30",
                  "transition-all duration-300",
                  "hover:scale-105 hover:shadow-xl hover:shadow-primary/40",
                )}
                onClick={handleAccept}
              >
                {generalT("accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieNotification;
