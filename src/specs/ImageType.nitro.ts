import type { HybridObject } from 'react-native-nitro-modules'

export interface ImageType
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly width: number
  readonly height: number
}

export interface ImageTypeFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  loadFromURL(url: string): Promise<ImageType>
}
