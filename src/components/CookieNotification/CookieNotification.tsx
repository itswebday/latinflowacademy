"use client";

import { motion } from "framer-motion";
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

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`
        z-100 fixed left-0 right-0 bottom-0
        bg-white border-t-2 border-primary/20 shadow-lg
        ${className}
      `}
    >
      {/* Container */}
      <div
        className={`
          flex flex-col justify-between items-start gap-6
          w-11/12 max-w-7xl py-6 mx-auto
          de:flex-row de:items-center de:gap-8
        `}
      >
        {/* Notification */}
        <p className="flex-1 text-dark">
          {generalT("cookieNotification")}{" "}
          <Link
            className="text-primary font-semibold transition-opacity duration-200 hover:opacity-70"
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
              "px-5 py-2.5 border-2 border-primary/30 rounded-sm",
              "font-medium text-dark/80 bg-white transition-all duration-200",
              "hover:bg-light hover:border-primary/60",
            )}
            onClick={handleDecline}
          >
            {generalT("decline")}
          </button>

          {/* Accept button */}
          <button
            className={twMerge(
              "px-5 py-2.5 text-white bg-primary rounded-sm",
              "font-semibold transition-all duration-200 hover:opacity-80",
            )}
            onClick={handleAccept}
          >
            {generalT("accept")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieNotification;
