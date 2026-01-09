"use client";

import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useNavMenu } from "@/contexts";
import HamburgerDash from "./HamburgerDash";

type HamburgerButtonProps = {
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const navMenu = useNavMenu();

  return (
    <motion.button
      className={twMerge(
        "flex flex-col justify-center items-center gap-1.5",
        "w-14 h-14 rounded-full",
        "bg-transparent border-2 border-white/30",
        "backdrop-blur-sm transition-all duration-300",
        "hover:scale-105 hover:border-white/60 hover:bg-white/5",
        "overflow-hidden relative",
        className,
      )}
      onClick={navMenu.toggle}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hamburger dashes */}
      <HamburgerDash dashIndex={0} />
      <HamburgerDash dashIndex={1} />
      <HamburgerDash dashIndex={2} />
    </motion.button>
  );
};

export default HamburgerButton;
