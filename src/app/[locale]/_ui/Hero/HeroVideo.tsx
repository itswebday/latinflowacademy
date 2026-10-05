"use client";

import type Hls from "hls.js/light";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type HeroVideoProps = {
  className?: string;
  landscapeSrc: string;
  portraitSrc: string;
};

const HLS_MIME_TYPE = "application/vnd.apple.mpegurl";

const HeroVideo: React.FC<HeroVideoProps> = ({
  className,
  landscapeSrc,
  portraitSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    // Keep the poster for reduced motion and data saver
    if (
      !video ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData
    ) {
      return;
    }

    const portrait = window.matchMedia("(orientation: portrait)");

    // Safari and every iOS browser play HLS natively; the rest use hls.js
    const isNativeHls =
      /Apple/.test(navigator.vendor) && video.canPlayType(HLS_MIME_TYPE) !== "";
    let hls: Hls | null = null;
    let loadCount = 0;
    let isVisible = true;
    let isCancelled = false;

    const play = () => {
      // Autoplay can still be refused (e.g. low-power mode): keep the poster
      video.play().catch(() => undefined);
    };

    const load = async () => {
      const src = portrait.matches ? portraitSrc : landscapeSrc;
      const loadId = ++loadCount;

      hls?.destroy();
      hls = null;
      video.muted = true;

      if (isNativeHls) {
        video.src = src;
      } else {
        const { default: HlsPlayer } = await import("hls.js/light");

        // Bail out if unmounted or superseded by a newer load
        if (isCancelled || loadId !== loadCount || !HlsPlayer.isSupported()) {
          return;
        }

        const player = new HlsPlayer({
          autoStartLoad: false,
          capLevelToPlayerSize: true,
        });

        // Start on the playlist's first variant (1080p / 720x1280), as
        // Safari does, instead of a 480p bandwidth probe
        player.on(HlsPlayer.Events.MANIFEST_PARSED, () => {
          player.startLevel = player.firstLevel;
          player.startLoad();
        });
        player.on(HlsPlayer.Events.ERROR, (_, data) => {
          if (data.fatal) {
            player.destroy();
            setIsPlaying(false);
          }
        });
        player.loadSource(src);
        player.attachMedia(video);
        hls = player;
      }

      if (isVisible) {
        play();
      }
    };

    // Rotating swaps the stream: fade back to the poster until it plays
    const reload = () => {
      setIsPlaying(false);
      load();
    };

    // Pause while scrolled out of view to save decoding and data
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        play();
      } else {
        video.pause();
      }
    });

    load();
    observer.observe(video);
    portrait.addEventListener("change", reload);

    return () => {
      isCancelled = true;
      observer.disconnect();
      portrait.removeEventListener("change", reload);
      hls?.destroy();
    };
  }, [landscapeSrc, portraitSrc]);

  return (
    <video
      className={twMerge(
        "absolute inset-0 w-full h-full object-cover",
        "opacity-0 transition-opacity duration-1000",
        isPlaying && "opacity-100",
        className,
      )}
      ref={videoRef}
      aria-hidden={true}
      muted={true}
      loop={true}
      playsInline={true}
      disablePictureInPicture={true}
      disableRemotePlayback={true}
      onPlaying={() => setIsPlaying(true)}
    />
  );
};

export default HeroVideo;
