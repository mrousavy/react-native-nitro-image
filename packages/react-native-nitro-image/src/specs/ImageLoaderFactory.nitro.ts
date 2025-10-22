import type { HybridObject } from "react-native-nitro-modules";
import type { ImageLoader } from "./ImageLoader.nitro";
import type { RawPixelData } from "./Image.nitro";

export interface ImageLoaderFactory
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    createFileImageLoader(filePath: string): ImageLoader;
    createResourceImageLoader(name: string): ImageLoader;
    createSymbolImageLoader(symbolName: string): ImageLoader;
    createRawArrayBufferImageLoader(data: RawPixelData): ImageLoader;
    createEncodedArrayBufferImageLoader(buffer: ArrayBuffer): ImageLoader;
}
