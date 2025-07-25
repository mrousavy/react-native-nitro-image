import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { Image } from "./Image.nitro";
import type { ImageLoader } from "./ImageLoader.nitro";

type ResizeMode = "cover" | "contain" | "center" | "stretch";

export interface NitroImageViewProps extends HybridViewProps {
    image?: Image | ImageLoader;
    resizeMode?: ResizeMode;
}

export interface NitroImageViewMethods extends HybridViewMethods {
    // no methods
}

export type NitroImageView = HybridView<
    NitroImageViewProps,
    NitroImageViewMethods
>;
