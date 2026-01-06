"use client";

import Marquee from "react-fast-marquee";
import { twMerge } from "tailwind-merge";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

const MarqueeComponent: React.FC<MarqueeProps> = ({
  children,
  className,
  speed = 50,
}) => {
  return (
    <Marquee className={twMerge(className)} speed={speed}>
      {children}
    </Marquee>
  );
};

export default MarqueeComponent;
