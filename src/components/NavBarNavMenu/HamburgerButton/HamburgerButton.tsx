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
        "w-12 h-12 rounded-lg",
        "bg-white/10 border border-white/20",
        "transition-colors duration-200",
        "hover:bg-white/20",
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
