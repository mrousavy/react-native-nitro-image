import { useEffect, useState } from "react";
import { type AsyncImageSource, isHybridObject } from "./AsyncImageSource";
import { loadImage } from "./loadImage";
import type { Image } from "./specs/Image.nitro";

/**
 * A hook to asynchronously load an image from the
 * given {@linkcode AsyncImageSource} into memory.
 * @example
 * ```ts
 * const image = useImage({ filePath: '/tmp/image.jpg' })
 * ```
 */
export function useImage(source: AsyncImageSource): Image | undefined {
    const [image, setImage] = useState<Image | undefined>();

    // biome-ignore lint: The dependencies array is a bit hacky.
    useEffect(() => {
        (async () => {
            const result = await loadImage(source);
            setImage(result);
        })();
    }, [isHybridObject(source) ? source : JSON.stringify(source)]);

    return image;
}
