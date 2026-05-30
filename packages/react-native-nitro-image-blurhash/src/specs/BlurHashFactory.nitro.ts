import type { Image } from 'react-native-nitro-image'
import type { HybridObject } from 'react-native-nitro-modules'

/**
 * BlurHashes are a compact (~20-30 char) base83 `string` placeholder
 * representation of an {@linkcode Image}. See https://blurha.sh/.
 */
export interface BlurHashFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Synchronously encodes the given {@linkcode Image} into a BlurHash `string`.
   * @param image The source Image to encode.
   * @param componentsX Number of X components in the hash (1-9). Typical: `4`.
   * @param componentsY Number of Y components in the hash (1-9). Typical: `3`.
   */
  encode(image: Image, componentsX: number, componentsY: number): string
  /**
   * Asynchronously encodes the given {@linkcode Image} into a BlurHash `string`.
   * @param image The source Image to encode.
   * @param componentsX Number of X components in the hash (1-9). Typical: `4`.
   * @param componentsY Number of Y components in the hash (1-9). Typical: `3`.
   */
  encodeAsync(
    image: Image,
    componentsX: number,
    componentsY: number,
  ): Promise<string>

  /**
   * Synchronously decodes the given BlurHash `string` into a low-resolution {@linkcode Image}.
   * @param blurhash The BlurHash string to decode.
   * @param width The width of the decoded Image.
   * @param height The height of the decoded Image.
   * @param punch Contrast boost. `1` = default, higher = punchier.
   * @throws If the given {@linkcode blurhash} is not a valid BlurHash.
   */
  decode(blurhash: string, width: number, height: number, punch: number): Image
  /**
   * Asynchronously decodes the given BlurHash `string` into a low-resolution {@linkcode Image}.
   */
  decodeAsync(
    blurhash: string,
    width: number,
    height: number,
    punch: number,
  ): Promise<Image>

  /**
   * Clears the decoder's in-memory cosine cache and frees memory.
   * No-op on iOS (the iOS decoder has no cache).
   * @platform Android
   */
  clearCosineCache(): void
}
