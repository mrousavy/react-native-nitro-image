import type { HybridObject } from 'react-native-nitro-modules'

export interface ImageUtils
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  thumbHashToBase64String(thumbhash: ArrayBuffer): string
  thumbhashFromBase64String(thumbhashBase64: string): ArrayBuffer
}
