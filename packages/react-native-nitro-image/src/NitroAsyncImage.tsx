import { NitroImage } from "./NitroImage";
import type { NitroImageViewProps } from "./specs/ImageView.nitro";
import type { AsyncImageSource } from "./AsyncImageSource";
import { useImageLoader } from "./useImageLoader";

export interface NitroAsyncImageProps extends Omit<NitroImageViewProps, 'image'> {
  image: AsyncImageSource
}

/**
 * The renderable asynchronous `<NitroAsyncImage />` view.
 *
 * This is a JS-based abstraction on-top of the
 * {@linkcode NitroImage | <NitroImage />} view to simplify
 * image loading.
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <NitroAsyncImage
 *       image={{ url: 'https://picsum.photos/seed/123/400' }}
 *       style={{ width: 100, height: 100 }}
 *     />
 *   )
 * }
 * ```
 */
export function NitroAsyncImage({ image, ...props }: NitroAsyncImageProps) {
  const actualImage = useImageLoader(image)
  return <NitroImage image={actualImage} {...props} />
}


