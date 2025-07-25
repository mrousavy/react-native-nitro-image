import type { HybridObject } from "react-native-nitro-modules";
import type { ImageLoader } from "./ImageLoader.nitro";

export interface ImageLoaderFactory
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    createFileImageLoader(filePath: string): ImageLoader;
    createResourceImageLoader(name: string): ImageLoader;
    createSymbolImageLoader(symbolName: string): ImageLoader;
    createArrayBufferImageLoader(buffer: ArrayBuffer): ImageLoader;
}
