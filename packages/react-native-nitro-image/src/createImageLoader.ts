import { Image as RNImage } from "react-native";
import {
    type AsyncImageSource,
    isHybridImage,
    isHybridImageLoader,
} from "./AsyncImageSource";
import { ImageLoaders } from "./ImageLoaders";
import { OptionalWebImages } from "./OptionalWebLoader";
import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export function createImageLoader(
    source: AsyncImageSource,
): ImageLoader | Image {
    if (typeof source === "number") {
        // It's a require(...) - a `number` which we need to resolve first
        const resolvedSource = RNImage.resolveAssetSource(source);
        if (resolvedSource.uri.startsWith('http')) {
            // In debug, assets are streamed over the network
            return createImageLoader({ url: resolvedSource.uri });
        } else if (resolvedSource.uri.startsWith('file')) {
            // In release, assets are embedded files...
            return createImageLoader({ filePath: resolvedSource.uri });
        } else {
            // ...or resource IDs
            return createImageLoader({ resource: resolvedSource.uri });
        }
    } else if (isHybridImage(source)) {
        return source;
    } else if (isHybridImageLoader(source)) {
        return source;
    } else if ("filePath" in source) {
        return ImageLoaders.createFileImageLoader(source.filePath);
    } else if ("arrayBuffer" in source) {
        return ImageLoaders.createArrayBufferImageLoader(source.arrayBuffer);
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
        throw new Error(`Unknown Image source! ${JSON.stringify(source)}`);
    }
}
