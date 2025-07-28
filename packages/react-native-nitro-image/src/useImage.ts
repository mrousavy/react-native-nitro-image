import { useEffect, useState } from "react";
import { isHybridImage, isHybridImageLoader, isHybridObject, type AsyncImageSource } from "./AsyncImageSource";
import type { Image } from "./specs/Image.nitro";
import { Images } from "./Images";
import { OptionalWebImages } from "./OptionalWebLoader";

function createLoader(source: AsyncImageSource): (() => Promise<Image>) | undefined {
  if (isHybridImage(source)) {
    // don't do anything if this already is a HybridImage
    return
  } else if (isHybridImageLoader(source)) {
    // It's an ImageLoader
    return () => source.loadImage()
  } else if ("filePath" in source) {
    // It's a { filePath }
    return () => Images.loadFromFileAsync(source.filePath)
  } else if ("arrayBuffer" in source) {
    // It's a { arrayBuffer }
    return () => Images.loadFromArrayBufferAsync(source.arrayBuffer)
  } else if ("resource" in source) {
    // It's a { resource }
    return () => Images.loadFromResourcesAsync(source.resource)
  } else if ("symbolName" in source) {
    // It's a { symbolName }
    return () => Promise.resolve(Images.loadFromSymbol(source.symbolName))
  } else if ("url" in source) {
    // It's a { url }
    return () => Promise.resolve(OptionalWebImages.loadImageAsync(source.url))
  } else {
    throw new Error(`Unknown Image source! ${JSON.stringify(source)}`)
  }
}

/**
 * A hook to asynchronously load an image from the
 * given {@linkcode AsyncImageSource} into memory.
 * @example
 * ```ts
 * const image = useImage({ filePath: '/tmp/image.jpg' })
 * ```
 */
export function useImage(source: AsyncImageSource): Image | undefined {
  const [image, setImage] = useState<Image | undefined>()

  // biome-ignore lint: The dependencies array is a bit hacky.
  useEffect(() => {
    const loader = createLoader(source)
    if (loader != null) {
      loader().then((i) => setImage(i))
    }
  }, [isHybridObject(source) ? source : JSON.stringify(source)])

  return isHybridImage(source) ? source : image
}
