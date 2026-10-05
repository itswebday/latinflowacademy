// Navigation menu
export const NAV_MENU_OPENING_DURATION = 500;
export const NAV_MENU_CLOSING_DELAY = 200;
export const NAV_MENU_CLOSING_DURATION = 500;

// Hero background video: HLS on Cloudflare plus first-frame posters
// (built by scripts/gen-hero-video.mjs, see docs/hero-video.md)
const HERO_VIDEO_URL =
  "https://latinflowacademy-media.devinsalsaweb.workers.dev/hero/v1";

export const HERO_VIDEO = {
  landscape: {
    src: `${HERO_VIDEO_URL}/landscape/master.m3u8`,
    poster: "/assets/hero/poster-landscape.jpg",
    width: 3840,
    height: 2160,
  },
  portrait: {
    src: `${HERO_VIDEO_URL}/portrait/master.m3u8`,
    poster: "/assets/hero/poster-portrait.jpg",
    width: 1216,
    height: 2160,
  },
} as const;
