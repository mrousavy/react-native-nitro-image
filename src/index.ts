import { NitroModules, getHostComponent } from 'react-native-nitro-modules'
import type { ImageFactory } from './specs/ImageFactory.nitro'
import type {
  NitroImageViewMethods,
  NitroImageViewProps,
} from './specs/ImageView.nitro'

/**
 * A factory for loading and creating `Image` instances.
 */
export const HybridImageFactory =
  NitroModules.createHybridObject<ImageFactory>('ImageFactory')

/**
 * The renderable `<NitroImage />` view.
 */
export const NitroImage = getHostComponent<
  NitroImageViewProps,
  NitroImageViewMethods
>('NitroImageView', () =>
  require('../nitrogen/generated/shared/json/NitroImageViewConfig.json')
)

/**
 * The core `Image` type from Nitro Image.
 */
export type { Image } from './specs/Image.nitro'
