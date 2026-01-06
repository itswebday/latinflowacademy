"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ScrollRestoration: React.FC = () => {
  const pathname = usePathname();
  const previousPathname = useRef<string>(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    const hasHash = typeof window !== "undefined" && window.location.hash;

    if (!hasHash) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      });
    } else {
      requestAnimationFrame(() => {
        const hash = window.location.hash;
        const targetElement = document.querySelector(hash);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
