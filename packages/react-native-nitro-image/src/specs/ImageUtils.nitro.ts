import type { HybridObject } from 'react-native-nitro-modules'

export interface ImageUtils
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Returns `true` when the host platform supports loading Images
   * in `HEIC` format.
   */
  readonly supportsHeicLoading: boolean
  /**
   * Returns `true` when the host platform supports writing Images
   * in `HEIC` format.
   */
  readonly supportsHeicWriting: boolean
}
