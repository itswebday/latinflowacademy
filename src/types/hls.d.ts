// hls.js ships no types for its light build, which shares the full build's API
declare module "hls.js/light" {
  export * from "hls.js";
  export { default } from "hls.js";
}
