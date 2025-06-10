import type { HybridObject } from 'react-native-nitro-modules'

export interface Image
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly width: number
  readonly height: number
}
