import { NitroModules } from 'react-native-nitro-modules'
import type { ImageUtils } from './specs/ImageUtils.nitro'

const utils = NitroModules.createHybridObject<ImageUtils>('ImageUtils')

export const thumbHashToString = utils.thumbhashToString.bind(utils)

export const thumbHashFromBase64String =
  utils.thumbhashFromBase64String.bind(utils)
