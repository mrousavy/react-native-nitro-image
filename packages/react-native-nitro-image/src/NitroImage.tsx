import { getHostComponent } from "react-native-nitro-modules";
import ViewConfig from "../nitrogen/generated/shared/json/NitroImageViewConfig.json";
import type {
    NitroImageViewMethods,
    NitroImageViewProps,
} from "./specs/ImageView.nitro";

/**
 * The native renderable `<NitroImage />` view.
 * @example
 * ```tsx
 * function App() {
 *   const image = useImage('https://picsum.photos/seed/123/400')
 *   return <NitroImage image={image} style={{ width: 100, height: 100 }} />
 * }
 * ```
 */
export const NitroImage = getHostComponent<
    NitroImageViewProps,
    NitroImageViewMethods
>("NitroImageView", () => ViewConfig);
