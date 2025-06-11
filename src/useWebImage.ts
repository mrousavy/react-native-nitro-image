import { loadImageFromURLAsync } from './ImageFactory'
import type { Image } from './specs/Image.nitro'
import { useEffect, useState } from 'react'

/**
 * A convenience hook to load a remote image from the given {@linkcode url}.
 */
export function useWebImage(url: string, newApi: boolean): Image | undefined {
  const [image, setImage] = useState<Image | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const i = await loadImageFromURLAsync(url, newApi)
        setImage(i)
      } catch (error) {
        console.error(`Failed to load image from "${url}"!`, error)
        setImage(undefined)
      }
    }
    load()
  }, [url, newApi])

  return image
}
