// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React from 'react'
import type { HostComponent } from 'react-native'
import { callback } from 'react-native-nitro-modules'
import type { AsyncImageSource } from './AsyncImageSource'
import { NativeNitroImage } from './NativeNitroImage'
import { useImageLoader } from './useImageLoader'

type ReactProps<T> = T extends HostComponent<infer P> ? P : never
type NativeImageProps = ReactProps<typeof NativeNitroImage>

export interface NitroImageProps extends Omit<NativeImageProps, 'image'> {
  image: AsyncImageSource
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
export function NitroImage({ image, onLoad, ...props }: NitroImageProps) {
  const actualImage = useImageLoader(image)
  const wrappedOnLoad = onLoad ? callback(onLoad) : undefined
  return (
    <NativeNitroImage image={actualImage} onLoad={wrappedOnLoad} {...props} />
  )
}
