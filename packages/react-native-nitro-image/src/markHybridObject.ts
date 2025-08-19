import { type AsyncImageSource, isHybridObject } from "./AsyncImageSource";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

let counter = 0;
export function markHybridObject(
    object: Image | ImageLoader,
    source: AsyncImageSource,
): typeof object {
    if (isHybridObject(source)) {
        // `source` is a HybridObject - to avoid recursion, we just set it to an incrementing counter.
        Object.defineProperty(object, "__source", {
            enumerable: true,
            configurable: true,
            value: counter,
        });
        counter++;
    } else {
        // `source` is just an input object, we can use it to tag the Image properly
        Object.defineProperty(object, "__source", {
            enumerable: true,
            configurable: true,
            value: source,
        });
    }
    return object;
}
