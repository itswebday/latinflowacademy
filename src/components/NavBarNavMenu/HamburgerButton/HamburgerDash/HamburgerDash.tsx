"use client";

import { motion } from "framer-motion";
import { useNavMenu } from "@/contexts";

type HamburgerDashProps = {
  dashIndex: 0 | 1 | 2;
};

const HamburgerDash: React.FC<HamburgerDashProps> = ({ dashIndex }) => {
  const navMenu = useNavMenu();

  const variants = {
    top: {
      closed: { rotate: 0, y: 0 },
      open: { rotate: 45, y: 8 },
    },
    middle: {
      closed: { opacity: 1, scale: 1 },
      open: { opacity: 0, scale: 0 },
    },
    bottom: {
      closed: { rotate: 0, y: 0 },
      open: { rotate: -45, y: -8 },
    },
  };

  const getVariant = () => {
    switch (dashIndex) {
      case 0:
        return variants.top;
      case 1:
        return variants.middle;
      case 2:
        return variants.bottom;
    }
  };

  return (
    <motion.div
      className="w-6 h-0.5 bg-white rounded-full"
      animate={navMenu.isOpen ? getVariant().open : getVariant().closed}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    />
  );
};

export default HamburgerDash;
