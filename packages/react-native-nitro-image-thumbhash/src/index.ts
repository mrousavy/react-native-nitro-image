import { NitroModules } from 'react-native-nitro-modules'
import type { ThumbHashFactory } from './specs/ThumbHashFactory.nitro'

export const ThumbHash =
  NitroModules.createHybridObject<ThumbHashFactory>('ThumbHashFactory')
