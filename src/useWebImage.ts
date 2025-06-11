import { loadImageFromURLAsync } from './ImageFactory'
import type { Image } from './specs/Image.nitro'
import { useEffect, useState } from 'react'

/**
 * A convenience hook to load a remote image from the given {@linkcode url}.
 */
export function useWebImage(url: string): Image | undefined {
  const [image, setImage] = useState<Image | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const i = await loadImageFromURLAsync(url)
        setImage(i)
      } catch (error) {
        console.error(`Failed to load image from "${url}"!`, error)
        setImage(undefined)
      }
    }
    load()
  }, [url])

  return image
}
