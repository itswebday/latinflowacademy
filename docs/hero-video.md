# Hero video

The homepage hero plays a muted, looping background video as adaptive HLS
from Cloudflare. It replaced a Vimeo embed that stopped playing when the
Vimeo account went private. This setup is temporary: it goes away when the
site moves to ByNoon hosting.

## Where it lives

| Part                  | Location                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Video files           | Assets-only Worker `latinflowacademy-media` (ByNoon Cloudflare account) on workers.dev, configured in `cloudflare/hero-media/` |
| Response headers      | `cloudflare/hero-media/public/_headers`: CORS for hls.js, one-year immutable caching                                           |
| Posters (first frame) | `public/assets/hero/`, shown while the video loads and for reduced motion or data saver                                        |
| URLs and sizes        | `HERO_VIDEO` in `src/constants/app.ts`                                                                                         |
| Player                | `src/app/[locale]/_ui/Hero/HeroVideo.tsx`                                                                                      |

The player uses native HLS on Safari and iOS, and the hls.js light build
(loaded on demand) elsewhere. Portrait viewports get the portrait stream,
playback starts on the 1080p (or 720x1280) variant, hls.js caps quality to
the player size, and the video pauses while scrolled out of view.

## Encoding

`scripts/gen-hero-video.mjs` (needs ffmpeg) turns the source into:

- a landscape ladder: 2160p60, 1440p60, 1080p60, 720p60 and 480p30
- a portrait ladder from the centre 9:16 crop: 1080x1920@60, 720x1280@60
  and 540x960@30
- H.264 in 2-second fMP4 segments with no audio (Workers static assets cap
  files at 25 MiB; the largest segment is about 6 MB)
- SDR BT.709, converted from the 4K60 HLG (BT.2020) source

The default window (2.6 s to 50.6 s of the source) skips its fade-in and
black tail, so the 48-second loop never flashes black.

## Replacing the video

Files are cached as immutable for a year, so every new encode gets a new
version folder; never overwrite one in place.

1. Encode into the next version (posters land in `public/assets/hero/`):
   `node scripts/gen-hero-video.mjs <source.mp4> cloudflare/hero-media/public/hero/v2`
2. Deploy with the previous version still in `public/hero/` (a deploy
   replaces the whole asset set, and the live site still points at it):
   `cd cloudflare/hero-media && wrangler deploy` (after `wrangler login`
   with the ByNoon account)
3. Point `HERO_VIDEO_URL` in `src/constants/app.ts` at `/hero/v2` and ship
   it with the new posters.
4. Once that is live, delete the old version folder and deploy again.

## Removing it

When the site moves to ByNoon, run `wrangler delete` in
`cloudflare/hero-media` and remove that folder along with this document.
