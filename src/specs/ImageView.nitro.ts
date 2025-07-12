import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'

type ResizeMode = 'cover' | 'contain' | 'center' | 'stretch'

export interface NitroImageViewProps extends HybridViewProps {
  image?: Image
  resizeMode?: ResizeMode
}

export interface NitroImageViewMethods extends HybridViewMethods {
  // no methods
}

export type NitroImageView = HybridView<
  NitroImageViewProps,
  NitroImageViewMethods
>
