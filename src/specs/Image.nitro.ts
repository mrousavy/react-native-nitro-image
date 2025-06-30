import type { HybridObject } from 'react-native-nitro-modules'

export type ImageFormat = 'jpg' | 'png'

export interface Image
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly width: number
  readonly height: number

  /**
   * Returns an array buffer containing the raw pixel data of the Image.
   * Raw pixel data is always in `ARGB` format;
   * ```
   * [
   *   A1, R1, G1, B1,
   *   A2, R2, G2, B2,
   *   ...
   * ]
   * ```
   */
  toArrayBuffer(): ArrayBuffer
  toArrayBufferAsync(): Promise<ArrayBuffer>

  /**
   * Resizes this Image into a new image with the new given {@linkcode width} and {@linkcode height}.
   */
  resize(width: number, height: number): Image
  resizeAsync(width: number, height: number): Promise<Image>

  /**
   * Saves this image in the given {@linkcode ImageFormat} to the given {@linkcode path}.
   */
  saveToFileAsync(
    path: string,
    format: ImageFormat,
    quality: number
  ): Promise<void>
  /**
   * Saves this image in the given {@linkcode ImageFormat} to a temporary file, and return it's path.
   */
  saveToTemporaryFileAsync(
    format: ImageFormat,
    quality: number
  ): Promise<string>

  /**
   * Encodes this Image into a ThumbHash.
   * To convert the returned ThumbHash to a string, use `thumbHashToBase64String(...)`.
   * @note To keep this efficient, {@linkcode resize} this image to a small size (<100x100) first.
   */
  toThumbHash(): ArrayBuffer
  toThumbHashAsync(): Promise<ArrayBuffer>
}
