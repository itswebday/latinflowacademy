"use client";

import { useNavMenu } from "@/contexts";
import HamburgerDash from "./HamburgerDash";

type HamburgerButtonProps = {
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const navMenu = useNavMenu();

  return (
    <button
      className={`
        z-50 flex flex-col justify-between w-20 h-full px-7 py-6
        xl:hidden
        ${className}
      `}
      onClick={navMenu.toggle}
    >
      {/* Hamburger dashes */}
      <HamburgerDash dashIndex={0} />
      <HamburgerDash dashIndex={1} />
      <HamburgerDash dashIndex={2} />
    </button>
  );
};

export default HamburgerButton;
