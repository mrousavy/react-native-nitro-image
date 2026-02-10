import { NitroModules } from 'react-native-nitro-modules'
import type { WebImageFactory } from './specs/WebImageFactory.nitro'

export const WebImages =
  NitroModules.createHybridObject<WebImageFactory>('WebImageFactory')
