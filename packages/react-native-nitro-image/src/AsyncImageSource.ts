import type { HybridObject } from "react-native-nitro-modules";
import type { OptionalAsyncOptions } from "./OptionalWebLoader";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export type RequireType = number;
export type AsyncImageSource =
    | Image
    | ImageLoader
    | { filePath: string }
    | { arrayBuffer: ArrayBuffer }
    | { resource: string }
    | { symbolName: string }
    | { url: string; options?: OptionalAsyncOptions }
    | RequireType;

// @ts-expect-error i know what I'm doing
export function isHybridObject<T>(obj: T): obj is HybridObject {
    // @ts-expect-error
    return typeof obj === "object" && obj != null && obj.dispose != null;
}
// @ts-expect-error i know what I'm doing
export function isHybridImage<T>(obj: T): obj is Image {
    // @ts-expect-error
    return typeof obj === "object" && obj != null && obj.toArrayBuffer != null;
}
export function isHybridImageLoader<T>(
    obj: T,
    // @ts-expect-error i know what I'm doing
): obj is ImageLoader {
    // @ts-expect-error
    return typeof obj === "object" && obj != null && obj.loadImage != null;
}
