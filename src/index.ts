import { NitroModules } from 'react-native-nitro-modules'
import type { ImageTypeFactory } from './specs/ImageType.nitro'

export const HybridImageTypeFactory =
  NitroModules.createHybridObject<ImageTypeFactory>('ImageTypeFactory')
