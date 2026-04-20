import { getHostComponent } from 'react-native-nitro-modules'
import ViewConfig from '../nitrogen/generated/shared/json/NitroAnimatedImageViewConfig.json'
import type {
  NativeNitroAnimatedImageViewMethods,
  NativeNitroAnimatedImageViewProps,
} from './specs/AnimatedImageView.nitro'

export const NativeNitroAnimatedImage = getHostComponent<
  NativeNitroAnimatedImageViewProps,
  NativeNitroAnimatedImageViewMethods
>('NitroAnimatedImageView', () => ViewConfig)
