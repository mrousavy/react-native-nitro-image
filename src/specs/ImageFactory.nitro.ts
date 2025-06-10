import type { HybridObject } from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'

export interface ImageFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  loadFromURL(url: string): Promise<Image>
}
