import { useMemo } from "react";
import { Image as RNImage } from "react-native";
import {
    type AsyncImageSource,
    isHybridImage,
    isHybridImageLoader,
    isHybridObject,
} from "./AsyncImageSource";
import { ImageLoaders } from "./ImageLoaders";
import { OptionalWebImages } from "./OptionalWebLoader";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export function useImageLoader(
    source: AsyncImageSource,
): Image | ImageLoader | undefined {
    // biome-ignore lint: The dependencies array is a bit hacky.
    return useMemo<Image | ImageLoader | undefined>(() => {
        if (typeof source === "number") {
            // It's a require(...)
            if (__DEV__) {
                // In debug, assets are streamed over the network
                const resolvedSource = RNImage.resolveAssetSource(source);
                return OptionalWebImages.createWebImageLoader(
                    resolvedSource.uri,
                );
            } else {
                // In release, assets are resource IDs
                return ImageLoaders.createResourceImageLoader(`${source}`);
            }
        } else if (isHybridImage(source)) {
            return source;
        } else if (isHybridImageLoader(source)) {
            return source;
        } else if ("filePath" in source) {
            return ImageLoaders.createFileImageLoader(source.filePath);
        } else if ("arrayBuffer" in source) {
            return ImageLoaders.createArrayBufferImageLoader(
                source.arrayBuffer,
            );
        } else if ("resource" in source) {
            return ImageLoaders.createResourceImageLoader(source.resource);
        } else if ("symbolName" in source) {
            return ImageLoaders.createSymbolImageLoader(source.symbolName);
        } else if ("url" in source) {
            return OptionalWebImages.createWebImageLoader(
                source.url,
                source.options,
            );
        } else {
            return undefined;
        }
    }, [isHybridObject(source) ? source : JSON.stringify(source)]);
}
