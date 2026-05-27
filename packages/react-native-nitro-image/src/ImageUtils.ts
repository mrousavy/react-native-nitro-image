import { NitroModules } from 'react-native-nitro-modules'
import type { ImageUtils } from './specs/ImageUtils.nitro'

const utils = NitroModules.createHybridObject<ImageUtils>('ImageUtils')

/**
 * Returns `true` when the host platform supports loading Images
 * in `HEIC` format.
 */
export const supportsHeicLoading = utils.supportsHeicLoading
/**
 * Returns `true` when the host platform supports writing Images
 * in `HEIC` format.
 */
export const supportsHeicWriting = utils.supportsHeicWriting
