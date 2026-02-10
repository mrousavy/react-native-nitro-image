import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'
import type { ImageLoader } from './ImageLoader.nitro'

/**
 * A resizing mode for fitting an Image inside an Image View.
 * - `cover`: Scale the content to fill the size of the view. Some portion of the content may be clipped to fill the view’s bounds.
 * - `contain`: Scale the content to fit the size of the view by maintaining the aspect ratio. Any remaining area of the view’s bounds is transparent.
 * - `center`: Center the content in the view’s bounds, keeping the proportions the same.
 * - `stretch`: Scale the content to fit the size of itself by changing the aspect ratio of the content if necessary.
 */
export type ResizeMode = 'cover' | 'contain' | 'center' | 'stretch'

export interface NativeNitroImageViewProps extends HybridViewProps {
  /**
   * Represents the image actually shown in this Image View.
   * - {@linkcode Image}: Shows a specific in-memory {@linkcode Image}
   * instance. Even when the view goes invisible, the image will still
   * be in-memory.
   * - {@linkcode ImageLoader}: Asynchronously loads an image from the
   * given {@linkcode ImageLoader} into the view when it becomes visible
   * ({@linkcode ImageLoader.requestImage | requestImage(…)}),
   * and drops it again when the view becomes invisible
   * ({@linkcode ImageLoader.dropImage | dropImage(…)}). This is
   * more efficient and works better for Lists.
   * - `undefined`: Shows no image.
   * @default undefined
   */
  image?: Image | ImageLoader
  /**
   * Specifies the resizing mode that will be applied when the Image
   * does not exactly match the Image View's width and height.
   * @see {@linkcode ResizeMode}
   * @default 'cover'
   */
  resizeMode?: ResizeMode
  /**
   * A key that uniquely identifies an Image that should be displayed.
   *
   * If the {@linkcode recyclingKey} changes, the displayed {@linkcode Image}
   * will be cleared to display _nothing_, until the next {@linkcode Image}
   * has been loaded.
   *
   * It is recommended to set this to the {@linkcode Image}'s URL in
   * large lists to prevent the recycled views from displaying
   * stale {@linkcode Image} instances.
   * @default undefined
   * @example
   * ```tsx
   * <NitroImage recyclingKey={url} />
   * ```
   */
  recyclingKey?: string
}

export interface NativeNitroImageViewMethods extends HybridViewMethods {
  // no methods
}

export type NitroImageView = HybridView<
  NativeNitroImageViewProps,
  NativeNitroImageViewMethods
>
