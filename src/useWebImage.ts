import { loadImageFromURLAsync } from './ImageFactory'
import type { Image } from './specs/Image.nitro'
import { useEffect, useState } from 'react'
import type { AsyncImageLoadOptions } from './specs/ImageFactory.nitro'

/**
 * A convenience hook to load a remote image from the given {@linkcode url}.
 */
export function useWebImage(
  url: string,
  options?: AsyncImageLoadOptions
): Image | undefined {
  const [image, setImage] = useState<Image | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const i = await loadImageFromURLAsync(url, options)
        setImage(i)
      } catch (error) {
        console.error(`Failed to load image from "${url}"!`, error)
        setImage(undefined)
      }
    }
    load()
    // `options` is missing from dependencies since it's a reference type that will be constructed each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return image
}
