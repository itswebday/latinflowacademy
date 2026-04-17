"use client";

import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: Array<{ price: string; text: string; url: string }>;
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  title,
  options,
}) => {
  const pricesT = useTranslations("prices");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div
        className={twMerge(
          "absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={twMerge(
          "relative bg-dark rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10 transform transition-all duration-500 ease-out",
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2
          className={twMerge(
            "text-3xl font-bold text-center mb-2 text-white",
            "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
          )}
        >
          {title}
        </h2>

        <p className="text-white/60 text-center mb-8 text-sm">
          {pricesT("subscriptionModal.subtitle")}
        </p>

        <div className="space-y-3">
          {options.map((option, index) => {
            if (!option.url || option.url.trim() === "") {
              return null;
            }

            return (
              <div
                key={index}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  {/* Price on the left */}
                  <div className="shrink-0">
                    <span className="text-[18px] font-bold text-white">
                      {option.price}
                    </span>
                  </div>

                  {/* Button on the right */}
                  <div className="flex-1">
                    <ButtonLink
                      variant="primaryButton"
                      href={option.url}
                      target="_blank"
                      className="w-fit"
                    >
                      {option.text}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SubscriptionModal;
