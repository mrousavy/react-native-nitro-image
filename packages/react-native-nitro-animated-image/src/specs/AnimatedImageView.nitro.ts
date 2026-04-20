import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules'

// redefining the ResizeMode prop instead of importing from nitro-image
// because for some reason using an exported `ResizeMode` prop from nitro-image breaks nitrogen
type ResizeMode = 'cover' | 'contain' | 'center' | 'stretch'

export interface NativeNitroAnimatedImageViewProps extends HybridViewProps {
  /**
   * The source of the animated image to display (GIF, animated WebP, APNG).
   * Accepts a URL, file path, or resource URI string.
   * @default undefined
   */
  image?: string
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
   * <NitroAnimatedImage recyclingKey={url} />
   * ```
   */
  recyclingKey?: string
  /**
   * Whether animated images (GIF, animated WebP, APNG) should
   * automatically start playing when loaded.
   * @default true
   */
  autoplay?: boolean
}

export interface NativeNitroAnimatedImageViewMethods extends HybridViewMethods {
  /**
   * Starts playing the animated image.
   * Has no effect if the image is not animated.
   */
  startAnimating(): void
  /**
   * Stops playing the animated image.
   * Has no effect if the image is not animated.
   */
  stopAnimating(): void
}

export type NitroAnimatedImageView = HybridView<
  NativeNitroAnimatedImageViewProps,
  NativeNitroAnimatedImageViewMethods
>
