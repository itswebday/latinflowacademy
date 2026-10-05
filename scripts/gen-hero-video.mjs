// Builds the hero background video: adaptive HLS ladders (landscape and
// portrait) for Cloudflare, plus first-frame posters for public/assets/hero.
//
// Usage: node scripts/gen-hero-video.mjs <source.mp4> <out-dir> [start] [end]
// Requires ffmpeg on PATH. See docs/hero-video.md.

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const POSTER_DIR = fileURLToPath(
  new URL("../public/assets/hero/", import.meta.url),
);

// Default window skips the source's fade-in and black tail (48 s, 24 segments)
const [source, outDir, start = "2.6", end = "50.6"] = process.argv.slice(2);

if (!source || !outDir) {
  console.error(
    "Usage: node scripts/gen-hero-video.mjs <source.mp4> <out-dir> [start] [end]",
  );
  process.exit(1);
}

const SEGMENT_SECONDS = 2;

// The source is 4K BT.2020 HLG; everything ships as SDR BT.709
const TO_BT709 =
  "format=yuv420p10le,colorspace=all=bt709:iall=bt2020:irange=tv:range=tv:fast=0:format=yuv420p10";

// Centre 9:16 slice of the 3840x2160 source (what phones show today)
const PORTRAIT_CROP = "crop=1216:2160:1312:0";

// The "start" rendition is listed first: Safari begins playback with it
const LADDERS = {
  landscape: [
    { width: 3840, height: 2160, fps: 60, crf: 18, maxrate: 20 },
    { width: 2560, height: 1440, fps: 60, crf: 19, maxrate: 12 },
    { width: 1920, height: 1080, fps: 60, crf: 20, maxrate: 7, start: true },
    { width: 1280, height: 720, fps: 60, crf: 21, maxrate: 4 },
    { width: 854, height: 480, fps: 30, crf: 22, maxrate: 1.5 },
  ],
  portrait: [
    { width: 1080, height: 1920, fps: 60, crf: 19, maxrate: 7 },
    { width: 720, height: 1280, fps: 60, crf: 21, maxrate: 3.5, start: true },
    { width: 540, height: 960, fps: 30, crf: 22, maxrate: 1.5 },
  ],
};

const run = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result.stdout;
};

const getName = ({ width, height }) => `${width}x${height}`;

// Encode every rendition in one pass (decode and colour-convert once)
const encodeLadders = () => {
  const graph = [
    `[0:v]${TO_BT709},split=2[landscape][portrait]`,
    `[portrait]${PORTRAIT_CROP}[portraitcrop]`,
  ];
  const outputs = [];

  for (const [orientation, ladder] of Object.entries(LADDERS)) {
    const input = orientation === "portrait" ? "portraitcrop" : orientation;
    const labels = ladder.map((_, index) => `${orientation}${index}`);

    graph.push(
      `[${input}]split=${ladder.length}${labels.map((label) => `[${label}in]`).join("")}`,
    );

    ladder.forEach((rendition, index) => {
      const dir = path.join(outDir, orientation, getName(rendition));
      const gop = rendition.fps * SEGMENT_SECONDS;
      const fps = rendition.fps === 60 ? "" : `fps=${rendition.fps},`;

      mkdirSync(dir, { recursive: true });
      graph.push(
        `[${labels[index]}in]${fps}scale=${rendition.width}:${rendition.height}:flags=lanczos,format=yuv420p[${labels[index]}]`,
      );
      outputs.push(
        ...["-map", `[${labels[index]}]`],
        ...["-c:v", "libx264", "-preset", "slow", "-profile:v", "high"],
        ...["-crf", String(rendition.crf)],
        ...[
          "-maxrate",
          `${rendition.maxrate}M`,
          "-bufsize",
          `${rendition.maxrate * 2}M`,
        ],
        ...[
          "-g",
          String(gop),
          "-keyint_min",
          String(gop),
          "-sc_threshold",
          "0",
        ],
        ...["-force_key_frames", `expr:gte(t,n_forced*${SEGMENT_SECONDS})`],
        ...["-x264-params", "aq-mode=3"],
        ...["-color_primaries", "bt709", "-color_trc", "bt709"],
        ...["-colorspace", "bt709", "-color_range", "tv"],
        "-an",
        ...["-f", "hls", "-hls_time", String(SEGMENT_SECONDS)],
        ...["-hls_playlist_type", "vod", "-hls_segment_type", "fmp4"],
        ...["-hls_fmp4_init_filename", "init.mp4"],
        ...["-hls_segment_filename", path.join(dir, "seg_%03d.m4s")],
        path.join(dir, "index.m3u8"),
      );
    });
  }

  run("ffmpeg", [
    ...["-hide_banner", "-loglevel", "warning", "-stats", "-y"],
    ...["-ss", start, "-t", (Number(end) - Number(start)).toFixed(3)],
    ...["-i", source],
    ...["-filter_complex", graph.join(";")],
    ...outputs,
  ]);
};

// Peak and average bits per second, measured from the written segments
const measureBandwidth = (dir) => {
  const lines = readFileSync(path.join(dir, "index.m3u8"), "utf8").split("\n");
  let peak = 0;
  let totalBits = 0;
  let totalSeconds = 0;

  lines.forEach((line, index) => {
    if (!line.startsWith("#EXTINF:")) {
      return;
    }

    const seconds = Number.parseFloat(line.slice("#EXTINF:".length));
    const bits = statSync(path.join(dir, lines[index + 1])).size * 8;

    peak = Math.max(peak, bits / seconds);
    totalBits += bits;
    totalSeconds += seconds;
  });

  return {
    peak: Math.ceil(peak),
    average: Math.ceil(totalBits / totalSeconds),
  };
};

// RFC 6381 codec string (e.g. avc1.640034 for High@5.2): the profile,
// constraint and level bytes that follow the version byte in the avcC box
const getCodec = (dir) => {
  const init = readFileSync(path.join(dir, "init.mp4"));
  const avcC = init.indexOf("avcC") + 4;

  return `avc1.${init.subarray(avcC + 1, avcC + 4).toString("hex")}`;
};

const writeMasterPlaylists = () => {
  for (const [orientation, ladder] of Object.entries(LADDERS)) {
    const lines = [
      "#EXTM3U",
      "#EXT-X-VERSION:7",
      "#EXT-X-INDEPENDENT-SEGMENTS",
    ];
    const ordered = [
      ...ladder.filter((rendition) => rendition.start),
      ...ladder.filter((rendition) => !rendition.start),
    ];

    for (const rendition of ordered) {
      const name = getName(rendition);
      const dir = path.join(outDir, orientation, name);
      const { peak, average } = measureBandwidth(dir);

      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${peak},AVERAGE-BANDWIDTH=${average},` +
          `CODECS="${getCodec(dir)}",RESOLUTION=${name},FRAME-RATE=${rendition.fps.toFixed(3)}`,
        `${name}/index.m3u8`,
      );
      console.log(
        `${orientation} ${name}: avg ${(average / 1e6).toFixed(1)} Mbps, peak ${(peak / 1e6).toFixed(1)} Mbps`,
      );
    }

    writeFileSync(
      path.join(outDir, orientation, "master.m3u8"),
      `${lines.join("\n")}\n`,
    );
  }
};

// High-quality JPEG of the loop's first frame (next/image derives the rest)
const writePosters = () => {
  mkdirSync(POSTER_DIR, { recursive: true });

  for (const [orientation, crop] of [
    ["landscape", ""],
    ["portrait", `${PORTRAIT_CROP},`],
  ]) {
    run("ffmpeg", [
      ...["-hide_banner", "-loglevel", "error", "-y"],
      ...["-ss", start, "-i", source, "-frames:v", "1"],
      ...[
        "-vf",
        `${TO_BT709},${crop}scale=in_color_matrix=bt709:in_range=tv,format=rgb24,format=yuvj420p`,
      ],
      ...["-q:v", "2"],
      path.join(POSTER_DIR, `poster-${orientation}.jpg`),
    ]);
  }
};

mkdirSync(outDir, { recursive: true });
encodeLadders();
writeMasterPlaylists();
writePosters();
console.log(`Done: ${outDir}`);
