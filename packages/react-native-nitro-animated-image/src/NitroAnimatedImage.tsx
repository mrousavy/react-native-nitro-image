import type React from 'react'
import { type HostComponent, Image as RNImage } from 'react-native'
import { callback } from 'react-native-nitro-modules'
import { NativeNitroAnimatedImage } from './NativeNitroAnimatedImage'
import type { NitroAnimatedImageView } from './specs/AnimatedImageView.nitro'

type ReactProps<T> = T extends HostComponent<infer P> ? P : never
type NativeAnimatedImageProps = ReactProps<typeof NativeNitroAnimatedImage>

export type AnimatedImageSource =
  | { url: string }
  | { filePath: string }
  | { resource: string }
  | number // require(...)

export type NitroAnimatedImageProps = Omit<
  NativeAnimatedImageProps,
  'image' | 'hybridRef'
> & {
  image: AnimatedImageSource
  ref?: React.RefObject<NitroAnimatedImageView | null>
}

function resolveSource(source: AnimatedImageSource): string | undefined {
  if (typeof source === 'number') {
    const resolved = RNImage.resolveAssetSource(source)
    return resolved?.uri
  }
  if ('url' in source) return source.url
  if ('filePath' in source) return source.filePath
  if ('resource' in source) return source.resource
  return undefined
}

export function NitroAnimatedImage({
  image,
  ref,
  ...props
}: NitroAnimatedImageProps) {
  return (
    <NativeNitroAnimatedImage
      image={resolveSource(image)}
      hybridRef={callback((r: NitroAnimatedImageView) => {
        if (ref) ref.current = r
      })}
      {...props}
    />
  )
}
