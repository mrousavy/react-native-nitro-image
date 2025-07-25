import { getHostComponent } from "react-native-nitro-modules";
import ViewConfig from "../nitrogen/generated/shared/json/NitroImageViewConfig.json";
import type {
    NitroImageViewMethods,
    NitroImageViewProps,
} from "./specs/ImageView.nitro";

/**
 * The renderable `<NitroWebImage />` view.
 */
export const NitroWebImage = getHostComponent<
    NitroImageViewProps,
    NitroImageViewMethods
>("NitroImageView", () => ViewConfig);
