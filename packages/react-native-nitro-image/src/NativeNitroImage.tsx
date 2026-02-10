import { getHostComponent } from 'react-native-nitro-modules'
import ViewConfig from '../nitrogen/generated/shared/json/NitroImageViewConfig.json'
import type {
  NativeNitroImageViewMethods,
  NativeNitroImageViewProps,
} from './specs/ImageView.nitro'

/**
 * The native renderable `<NativeNitroImage />` view.
 * @example
 * ```tsx
 * function App() {
 *   const image = useImage('https://picsum.photos/seed/123/400')
 *   return <NativeNitroImage image={image} style={{ width: 100, height: 100 }} />
 * }
 * ```
 */
export const NativeNitroImage = getHostComponent<
  NativeNitroImageViewProps,
  NativeNitroImageViewMethods
>('NitroImageView', () => ViewConfig)
