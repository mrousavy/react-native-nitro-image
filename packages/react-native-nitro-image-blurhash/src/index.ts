import { NitroModules } from 'react-native-nitro-modules'
import type { BlurHashFactory } from './specs/BlurHashFactory.nitro'

export const BlurHash =
  NitroModules.createHybridObject<BlurHashFactory>('BlurHashFactory')

export type { IsBlurhashValidResult } from './utils'
export { getAverageColor, isBlurhashValid } from './utils'
