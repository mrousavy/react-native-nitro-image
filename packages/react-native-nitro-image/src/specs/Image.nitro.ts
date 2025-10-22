import type { HybridObject } from "react-native-nitro-modules";

/**
 * Represents the pixel ordering format.
 * - `ARGB`: `[alpha, red, green, blue]`
 * - `BGRA`: `[blue, green, red, alpha]`
 * - `ABGR`: `[alpha, blue, green, red]`
 * - `RGBA`: `[red, green, blue, alpha]`
 * - `XRGB`: `[skip, red, green, blue]`
 * - `BGRX`: `[blue, green, red, skip]`
 * - `XBGR`: `[skip, blue, green, red]`
 * - `RGBX`: `[red, green, blue, skip]`
 * - `RGB`: `[red, green, blue]`
 * - `BGR`: `[blue, green, red]`
 * - `unknown`: Unknown pixel format.
 *
 * `A` means alpha, `X` means placeholder - skip alpha.
 */
export type PixelFormat = "ARGB" | "BGRA" | "ABGR" | "RGBA" | "XRGB" | "BGRX" | "XBGR" | "RGBX" | "RGB" | "BGR" | "unknown";

/**
 * Describes the format of an encoded Image.
 */
export type ImageFormat = "jpg" | "png";

/**
 * Describes raw pixel data (`buffer`) with `width`, `height` and `pixelFormat`.
 */
export interface RawPixelData {
    buffer: ArrayBuffer;
    width: number;
    height: number;
    pixelFormat: PixelFormat;
}

/**
 * Describes encoded image data (`buffer`) with `width`, `height` and `imageFormat`.
 */
export interface EncodedImageData {
    buffer: ArrayBuffer;
    width: number;
    height: number;
    imageFormat: ImageFormat;
}

/**
 * A native Image instance.
 */
export interface Image
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    readonly width: number;
    readonly height: number;

    /**
     * Returns an {@linkcode ArrayBuffer} containing the raw pixel data of the Image.
     * @note Raw pixel data is either in {@linkcode PixelFormat | 'ARGB'} or
     * {@linkcode PixelFormat | 'BGRA'} format, depending on the OS' endianess.
     * @example
     * ```ts
     * const rawData = image.toRawArrayBuffer()
     * const data = new Uint8Array(rawData.buffer)
     * let r, g, b
     * if (rawData.pixelFormat === 'bgra') {
     *   r = data[2]
     *   g = data[1]
     *   b = data[0]
     * } else {
     *   r = data[0]
     *   g = data[1]
     *   b = data[2]
     * }
     * ```
     */
    toRawPixelData(): RawPixelData;
    toRawPixelDataAsync(): Promise<RawPixelData>;

    /**
     * Returns an {@linkcode ArrayBuffer} containing the encoded data of an Image in
     * the requested container {@linkcode format}.
     * @note If the requested {@linkcode format} is {@linkcode ImageFormat | 'jpg'}, you can use
     * {@linkcode quality} to compress the image. In {@linkcode ImageFormat | 'png'}, the
     * {@linkcode quality} flag is ignored.
     * @example
     * ```ts
     * const compressed = image.toEncodedArrayBuffer('jpg', 0.7)
     * ```
     */
    toEncodedImageData(format: ImageFormat, quality?: number): EncodedImageData;
    toEncodedImageDataAsync(
        format: ImageFormat,
        quality?: number,
    ): Promise<EncodedImageData>;

    /**
     * Resizes this Image into a new image with the new given {@linkcode width} and {@linkcode height}.
     * @example
     * ```ts
     * const smaller = image.resize(image.width / 2, image.height / 2)
     * ```
     */
    resize(width: number, height: number): Image;
    resizeAsync(width: number, height: number): Promise<Image>;

    /**
     * Crops this Image into a new image starting from the source image's {@linkcode startX} and {@linkcode startY} coordinates,
     * up until the source image's {@linkcode endX} and {@linkcode endY} coordinates.
     * @example
     * ```ts
     * const cropped = image.crop(
     *     image.width * 0.1,
     *     image.height * 0.1,
     *     image.width * 0.8,
     *     image.height * 0.8
     * )
     * ```
     */
    crop(startX: number, startY: number, endX: number, endY: number): Image;
    cropAsync(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
    ): Promise<Image>;

    /**
     * Saves this image in the given {@linkcode ImageFormat} to the given {@linkcode path}.
     * @example
     * ```ts
     * await image.saveToFileAsync(path, 'jpg', 0.8)
     * ```
     */
    saveToFileAsync(
        path: string,
        format: ImageFormat,
        quality?: number,
    ): Promise<void>;
    /**
     * Saves this image in the given {@linkcode ImageFormat} to a temporary file, and return it's path.
     * @example
     * ```ts
     * const path = await image.saveToTemporaryFileAsync('jpg', 0.8)
     * ```
     */
    saveToTemporaryFileAsync(
        format: ImageFormat,
        quality?: number,
    ): Promise<string>;

    /**
     * Encodes this Image into a ThumbHash.
     * To convert the returned ThumbHash to a string, use `thumbHashToBase64String(...)`.
     * @note To keep this efficient, {@linkcode resize} this image to a small size (<100x100) first.
     * @example
     * ```ts
     * const small = image.resize(100, 100)
     * const thumbHash = small.toThumbHash()
     * ```
     */
    toThumbHash(): ArrayBuffer;
    toThumbHashAsync(): Promise<ArrayBuffer>;
}
