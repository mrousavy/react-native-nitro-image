import { NitroModules } from 'react-native-nitro-modules'
import type { ImageFactory } from './specs/ImageFactory.nitro'

export const HybridImageFactory =
  NitroModules.createHybridObject<ImageFactory>('ImageFactory')
