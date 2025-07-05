import type { HybridObject } from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'

export type AsyncImagePriority = 'low' | 'default' | 'high'

export interface AsyncImageLoadOptions {
  /**
   * Specifies the priority of the image download.
   * @default 'default'
   */
  priority?: AsyncImagePriority

  /**
   * Forces a cache refresh even if the URL is changed.
   * Use this if you cannot make your URLs static.
   * @default false
   */
  forceRefresh?: boolean

  /**
   * Allows the Image download to continue even when the app is backgrounded.
   * @default false
   */
  continueInBackground?: boolean

  /**
   * Enable to allow untrusted SSL certificates.
   * @default false
   */
  allowInvalidSSLCertificates?: boolean

  /**
   * Scales down larger images to respect the device's memory constraints (max. 60 MB, or 4096x4096)
   * @default false
   */
  scaleDownLargeImages?: boolean

  /**
   * By default, cached images are queried from memory **asynchronously** to avoid UI lag.
   * If this flag is enabled, images are queried **synchronously** from memory.
   * @default false
   */
  queryMemoryDataSync?: boolean
  /**
   * By default, cached images are queried from disk **asynchronously** to avoid UI lag.
   * If this flag is enabled, images are queried **synchronously** from disk.
   * @default false
   */
  queryDiskDataSync?: boolean

  /**
   * By default, images are decoded from binary data to actual image representations.
   * Disabling this might speed up downloads, but could increase memory usage.
   * @default true
   */
  decodeImage?: boolean
}

export interface ImageFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Asynchronously loads an {@linkcode Image} from the given {@linkcode url}.
   * @param url The URL of the {@linkcode Image}. Must start with `https://...`
   * @throws If the {@linkcode url} is invalid.
   * @throws If the network request cannot be made.
   * @throws If the data at the given {@linkcode url} cannot be parsed as an {@linkcode Image}.
   */
  loadFromURLAsync(url: string, options?: AsyncImageLoadOptions): Promise<Image>
  /**
   * Asynchronously loads an {@linkcode Image} from the given asset identifier.
   * @param name The asset identifier of the image to load.
   * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
   * @platform iOS 8
   */
  loadFromAssetAsync(assetId: string): Promise<Image>
  /**
   * Synchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
   * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
   * @throws If the {@linkcode filePath} is invalid.
   * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
   */
  loadFromFile(filePath: string): Image
  /**
   * Asynchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
   * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
   * @throws If the {@linkcode filePath} is invalid.
   * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
   */
  loadFromFileAsync(filePath: string): Promise<Image>

  /**
   * Synchronously loads an {@linkcode Image} from the given resource-/system-name.
   * @param name The resource-/system-name of the image to load.
   * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
   * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
   */
  loadFromResources(name: string): Image
  /**
   * Asynchronously loads an {@linkcode Image} from the given resource-/system-name.
   * @param name The resource-/system-name of the image to load.
   * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
   * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
   */
  loadFromResourcesAsync(name: string): Promise<Image>

  /**
   * Synchronously loads an {@linkcode Image} from the given symbol name.
   * This is iOS only!
   * @param symbolName The symbol name of the image to load. On iOS, this is the SF Symbols Name.
   * @throws If no {@linkcode Image} symbol exists under the given {@linkcode symbolName}.
   * @platform iOS 13
   */
  loadFromSymbol(symbolName: string): Image

  /**
   * Synchronously convert the given given {@linkcode ArrayBuffer} to an {@linkcode Image}.
   * @param buffer
   * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
   */
  loadFromArrayBuffer(buffer: ArrayBuffer): Image
  /**
   * Asynchronously convert the given given {@linkcode ArrayBuffer} to an {@linkcode Image}.
   * @param buffer
   * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
   */
  loadFromArrayBufferAsync(buffer: ArrayBuffer): Promise<Image>

  loadFromThumbHash(thumbhash: ArrayBuffer): Image
  loadFromThumbHashAsync(thumbhash: ArrayBuffer): Promise<Image>
}
