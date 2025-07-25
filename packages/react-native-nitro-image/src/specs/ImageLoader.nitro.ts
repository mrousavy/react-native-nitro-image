import type { HybridObject } from "react-native-nitro-modules";
import type { Image } from "./Image.nitro";
import type { NitroImageView } from "./ImageView.nitro";

export interface ImageLoader
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    /**
     * Imperatively loads this `Image` using the underlying load implementation.
     */
    loadImage(): Promise<Image>;

    /**
     * Called by an Image View when it becomes visible.
     * The native implementation must set the `image` on the `imageView` by downcasting it to a concrete type.
     * @param forView The native view type (e.g. `HybridImageView`)
     */
    requestImage(forView: NitroImageView): void;
    /**
     * Called by an Image View when it becomes invisible.
     * The native implementation can remove the `image` on the `imageView` if needed to save memory.
     * @param forView The native view type (e.g. `HybridImageView`)
     */
    dropImage(forView: NitroImageView): void;
}
