import type { Image } from 'react-native-nitro-image'
import type { HybridObject } from 'react-native-nitro-modules'

/**
 * ThumbHashes are a compact (~25 byte) binary placeholder representation of an
 * Image, designed by Evan Wallace. See https://evanw.github.io/thumbhash/.
 *
 * Use {@linkcode encode} to produce a ThumbHash from an existing {@linkcode Image},
 * and {@linkcode decode} to reconstruct a low-resolution {@linkcode Image} from a
 * previously stored ThumbHash. {@linkcode toBase64String} /
 * {@linkcode fromBase64String} convert between the binary {@linkcode ArrayBuffer}
 * representation and a portable Base64 `string`.
 */
export interface ThumbHashFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Encodes the given {@linkcode Image} into a ThumbHash.
   *
   * To keep this efficient, {@linkcode Image.resize} the source down to <100x100
   * pixels before encoding.
   *
   * @example
   * ```ts
   * const small = image.resize(100, 100)
   * const hash = ThumbHashes.encode(small)
   * ```
   */
  encode(image: Image): ArrayBuffer
  encodeAsync(image: Image): Promise<ArrayBuffer>

  /**
   * Decodes the given ThumbHash {@linkcode ArrayBuffer} back into a low-resolution
   * {@linkcode Image}.
   *
   * @throws If the given {@linkcode thumbhash} is not a valid ThumbHash.
   */
  decode(thumbhash: ArrayBuffer): Image
  decodeAsync(thumbhash: ArrayBuffer): Promise<Image>

  /**
   * Converts the given ThumbHash {@linkcode ArrayBuffer} to a Base64-encoded `string`.
   */
  toBase64String(thumbhash: ArrayBuffer): string

  /**
   * Converts the given Base64-encoded ThumbHash `string` to an {@linkcode ArrayBuffer}.
   */
  fromBase64String(thumbhashBase64: string): ArrayBuffer
}
