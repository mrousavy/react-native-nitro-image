import { getHostComponent } from 'react-native-nitro-modules'
import type {
  NitroImageViewMethods,
  NitroImageViewProps,
} from './specs/ImageView.nitro'
import ViewConfig from '../nitrogen/generated/shared/json/NitroImageViewConfig.json'

/**
 * The renderable `<NitroImage />` view.
 */
export const NitroImage = getHostComponent<
  NitroImageViewProps,
  NitroImageViewMethods
>('NitroImageView', () => ViewConfig)
