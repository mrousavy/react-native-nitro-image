import React from 'react'
import type { HostComponent } from 'react-native'
import type { AsyncImageSource } from './AsyncImageSource'
import { NativeNitroImage } from './NativeNitroImage'
import type { NitroImageView } from './specs/ImageView.nitro'
import { useImageLoader } from './useImageLoader'

type ReactProps<T> = T extends HostComponent<infer P> ? P : never
type NativeImageProps = ReactProps<typeof NativeNitroImage>

export interface NitroImageProps extends Omit<NativeImageProps, 'image'> {
  image: AsyncImageSource
  /**
   * When `false`, cancels the in-flight {@linkcode ImageLoader} request.
   * When `true`, resumes it. Typically driven by `useIsFocused()`.
   * @default true
   */
  isActive?: boolean
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
export function NitroImage({
  image,
  isActive = true,
  ...props
}: NitroImageProps) {
  const actualImage = useImageLoader(image)
  const viewRef = React.useRef<NitroImageView>(null)
  React.useEffect(() => {
    viewRef.current?.setIsActive(isActive)
  }, [isActive])
  return (
    <NativeNitroImage
      image={actualImage}
      hybridRef={{ f: (r) => (viewRef.current = r) }}
      {...props}
    />
  )
}
