import type { HybridObject } from "react-native-nitro-modules";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export type AsyncImageSource =
  | Image
  | ImageLoader
  | { filePath: string }
  | { arrayBuffer: ArrayBuffer }
  | { resource: string }
  | { symbolName: string }
  | { url: string }

// @ts-expect-error i know what I'm doing
export function isHybridObject<T extends object>(obj: T): obj is HybridObject {
  // @ts-expect-error
  return typeof obj === 'object' && obj != null && obj.dispose != null
}
// @ts-expect-error i know what I'm doing
export function isHybridImage<T extends object>(obj: T): obj is Image {
  // @ts-expect-error
  return typeof obj === 'object' && obj != null && obj.toArrayBuffer != null
}
// @ts-expect-error i know what I'm doing
export function isHybridImageLoader<T extends object>(obj: T): obj is ImageLoader {
  // @ts-expect-error
  return typeof obj === 'object' && obj != null && obj.loadImage != null
}
