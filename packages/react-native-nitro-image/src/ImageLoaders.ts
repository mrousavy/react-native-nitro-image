import { NitroModules } from "react-native-nitro-modules";
import type { ImageLoaderFactory } from "./specs/ImageLoaderFactory.nitro";

/**
 * A factory for creating `ImageLoader` instances.
 */
export const ImageLoaders =
    NitroModules.createHybridObject<ImageLoaderFactory>("ImageLoaderFactory");
