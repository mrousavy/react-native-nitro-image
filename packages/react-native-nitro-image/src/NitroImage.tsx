// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React from 'react'
import type { HostComponent } from 'react-native'
import type { AsyncImageSource } from './AsyncImageSource'
import { NativeNitroImage } from './NativeNitroImage'
import { useImageLoader } from './useImageLoader'
import { type LocalImageSource, useLocalImage } from './useLocalImage'

type ReactProps<T> = T extends HostComponent<infer P> ? P : never
type NativeImageProps = ReactProps<typeof NativeNitroImage>

export interface NitroImageProps
  extends Omit<NativeImageProps, 'image' | 'placeholder'> {
  image: AsyncImageSource
  /**
   * An optional placeholder shown while {@linkcode image} is loading.
   *
   * Restricted to local sources (require, file path, raw/encoded data,
   * resource, symbol, or a pre-decoded {@linkcode Image}) so the placeholder
   * itself never fires a network request. Pass a `require(...)` asset or a
   * blurhash/thumbhash decode for best results.
   */
  placeholder?: LocalImageSource
}

/**
 * The renderable asynchronous `<NitroImage />` view.
 *
 * This is a JS-based abstraction on-top of the
 * {@linkcode NativeNitroImage | <NativeNitroImage />} view to simplify
 * image loading.
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <NitroImage
 *       image={{ url: 'https://picsum.photos/seed/123/400' }}
 *       style={{ width: 100, height: 100 }}
 *     />
 *   )
 * }
 * ```
 */
export function NitroImage({ image, placeholder, ...props }: NitroImageProps) {
  const actualImage = useImageLoader(image)
  const { image: actualPlaceholder } = useLocalImage(placeholder)
  return (
    <NativeNitroImage
      image={actualImage}
      placeholder={actualPlaceholder}
      {...props}
    />
  )
}
