import type { HybridObject } from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'

export interface ImageFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Asynchronously loads an {@linkcode Image} from the given {@linkcode url}.
   * @param url The URL of the {@linkcode Image}. Must start with `https://...`
   * @throws If the {@linkcode url} is invalid.
   * @throws If the network request cannot be made.
   * @throws If the data at the given {@linkcode url} cannot be parsed as an {@linkcode Image}.
   */
  loadFromURL(url: string): Promise<Image>

  /**
   * Synchronously loads an {@linkcode Image} from the given resource-/system-name.
   * @param name The resource-/system-name of the image to load.
   * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
   * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
   */
  loadFromResources(name: string): Image

  /**
   * Synchronously loads an {@linkcode Image} from the given symbol name.
   * This is iOS only!
   * @param symbolName The symbol name of the image to load. On iOS, this is the SF Symbols Name.
   * @throws If no {@linkcode Image} symbol exists under the given {@linkcode symbolName}.
   * @platform iOS 13
   */
  loadFromSymbol(symbolName: string): Image
}
