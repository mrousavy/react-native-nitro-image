import { useEffect, useState } from "react";
import { type AsyncImageSource, isHybridObject } from "./AsyncImageSource";
import { loadImage } from "./loadImage";
import { markHybridObject } from "./markHybridObject";
import type { Image } from "./specs/Image.nitro";

type Result =
    // Loading State
    | {
          image: undefined;
          error: undefined;
      }
    // Loaded state
    | {
          image: Image;
          error: undefined;
      }
    // Error state
    | {
          image: undefined;
          error: Error;
      };

/**
 * A hook to asynchronously load an image from the
 * given {@linkcode AsyncImageSource} into memory.
 * @example
 * ```ts
 * const { image, error } = useImage({ filePath: '/tmp/image.jpg' })
 * ```
 */
export function useImage(source: AsyncImageSource): Result {
    const [image, setImage] = useState<Result>({
        image: undefined,
        error: undefined,
    });

    // biome-ignore lint: The dependencies array is a bit hacky.
    useEffect(() => {
        // clear state each time we will load a new image
        if (image.image || image.error) {
            setImage({ image: undefined, error: undefined });
        }

        (async () => {
            try {
                // 1. Create the Image/ImageLoader instance
                const result = await loadImage(source);
                // 2. Add `__source` as a property on the JS side so React diffs properly
                markHybridObject(result, source);
                // 3. Update the state
                setImage({ image: result, error: undefined });
            } catch (e) {
                const error = e instanceof Error ? e : new Error(`${e}`);
                setImage({ image: undefined, error: error });
            }
        })();
    }, [isHybridObject(source) ? source : JSON.stringify(source)]);

    return image;
}
