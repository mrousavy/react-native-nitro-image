import { useMemo } from "react";
import { type AsyncImageSource, isHybridObject } from "./AsyncImageSource";
import { createImageLoader } from "./createImageLoader";
import { markHybridObject } from "./markHybridObject";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export function useImageLoader(
    source: AsyncImageSource,
): Image | ImageLoader | undefined {
    // biome-ignore lint: The dependencies array is a bit hacky.
    return useMemo<Image | ImageLoader | undefined>(() => {
        // 1. Create the Image/ImageLoader instance
        const loader = createImageLoader(source);
        // 2. Add `__source` as a property on the JS side so React diffs properly
        markHybridObject(loader, source);
        // 3. Return it
        return loader;
    }, [isHybridObject(source) ? source : JSON.stringify(source)]);
}
