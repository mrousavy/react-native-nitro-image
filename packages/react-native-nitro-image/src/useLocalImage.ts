import { useEffect, useState } from 'react'
import { type AsyncImageSource, isHybridObject } from './AsyncImageSource'
import { loadImage } from './loadImage'
import { markHybridObject } from './markHybridObject'
import type { Image } from './specs/Image.nitro'
import type { ImageLoader } from './specs/ImageLoader.nitro'

/**
 * Same shape as {@linkcode AsyncImageSource} but with remote URLs and
 * `ImageLoader`s excluded, so resolving the source never fires a network
 * request. Useful for things like the `placeholder` prop on `<NitroImage />`.
 */
export type LocalImageSource = Exclude<
  AsyncImageSource,
  { url: string } | ImageLoader
>

type Result =
  | { image: undefined; error: undefined }
  | { image: Image; error: undefined }
  | { image: undefined; error: Error }

/**
 * Like {@linkcode useImage}, but only accepts local sources (no URLs, no
 * `ImageLoader`s) and `undefined`.
 */
export function useLocalImage(source: LocalImageSource | undefined): Result {
  const [result, setResult] = useState<Result>({
    image: undefined,
    error: undefined,
  })

  // biome-ignore lint: The dependencies array is a bit hacky.
  useEffect(() => {
    if (source == null) {
      setResult({ image: undefined, error: undefined })
      return
    }
    ;(async () => {
      try {
        const img = await loadImage(source)
        // Tag with `__source` so React diffs the placeholder prop properly.
        markHybridObject(img, source)
        setResult({ image: img, error: undefined })
      } catch (e) {
        const error = e instanceof Error ? e : new Error(`${e}`)
        setResult({ image: undefined, error })
      }
    })()
  }, [
    source == null
      ? null
      : isHybridObject(source)
        ? source
        : JSON.stringify(source),
  ])

  return result
}
