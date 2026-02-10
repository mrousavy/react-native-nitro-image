import { NitroModules } from 'react-native-nitro-modules'
import type { ImageFactory } from './specs/ImageFactory.nitro'

/**
 * A factory for loading and creating `Image` instances.
 */
export const Images =
  NitroModules.createHybridObject<ImageFactory>('ImageFactory')
