import { useMemo } from "react";
import { type AsyncImageSource, isHybridObject } from "./AsyncImageSource";
import { createImageLoader } from "./createImageLoader";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export function useImageLoader(
    source: AsyncImageSource,
): Image | ImageLoader | undefined {
    // biome-ignore lint: The dependencies array is a bit hacky.
    return useMemo<Image | ImageLoader | undefined>(
        () => createImageLoader(source),
        [isHybridObject(source) ? source : JSON.stringify(source)],
    );
}
