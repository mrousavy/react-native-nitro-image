import type {
  HybridView,
  HybridViewMethods,
  HybridViewProps,
} from 'react-native-nitro-modules'
import type { Image } from './Image.nitro'

export interface NitroImageViewProps extends HybridViewProps {
  image?: Image
}

export interface NitroImageViewMethods extends HybridViewMethods {
  // no methods
}

export type NitroImageView = HybridView<
  NitroImageViewProps,
  NitroImageViewMethods
>
