"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

type BackgroundVideoProps = {
  className?: string;
  src: string;
  alt: string;
  type: string;
};

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  className,
  src,
  alt,
  type,
}) => {
  const generalT = useTranslations("general");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;

      if (video && video.paused) {
        video.play();
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        z-0 absolute inset-0
        ${className}
      `}
    >
      {/* Video */}
      <video
        className="object-cover w-full h-full"
        ref={videoRef}
        aria-label={alt}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
      >
        <source src={src} type={type} />
        {generalT("videoTagNotSupported")}
      </video>
    </div>
  );
};

export default BackgroundVideo;
