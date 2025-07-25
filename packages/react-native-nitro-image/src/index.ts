/**
 * The core `Image` type from Nitro Image.
 */

/**
 * All the methods to create `Image` types
 */
export * from "./ImageFactory";
/**
 * All the utils for Images, like ThumbHash <> String conversion
 */
export * from "./ImageUtils";

export { NitroImage } from "./NitroImage";
export { NitroWebImage } from "./NitroWebImage";
export type { Image } from "./specs/Image.nitro";
/**
 * The `useWebImage` hook
 */
export { useWebImage } from "./useWebImage";
