import { Image as RNImage } from "react-native";
import {
    type AsyncImageSource,
    isHybridImage,
    isHybridImageLoader,
} from "./AsyncImageSource";
import { Images } from "./Images";
import { OptionalWebImages } from "./OptionalWebLoader";
import type { Image } from "./specs/Image.nitro";

export function loadImage(source: AsyncImageSource): Promise<Image> | Image {
    if (typeof source === "number") {
        // It's a require(...) - a `number` which we need to resolve first
        const resolvedSource = RNImage.resolveAssetSource(source);
        if (__DEV__) {
            // In debug, assets are streamed over the network
            return loadImage({ url: resolvedSource.uri });
        } else {
            // In release, assets are resource IDs
            return loadImage({ resource: resolvedSource.uri });
        }
    } else if (isHybridImage(source)) {
        // don't do anything if this already is a HybridImage
        return source;
    } else if (isHybridImageLoader(source)) {
        // It's an ImageLoader
        return source.loadImage();
    } else if ("filePath" in source) {
        // It's a { filePath }
        return Images.loadFromFileAsync(source.filePath);
    } else if ("arrayBuffer" in source) {
        // It's a { arrayBuffer }
        return Images.loadFromArrayBufferAsync(source.arrayBuffer);
    } else if ("resource" in source) {
        // It's a { resource }
        return Images.loadFromResourcesAsync(source.resource);
    } else if ("symbolName" in source) {
        // It's a { symbolName }
        return Promise.resolve(Images.loadFromSymbol(source.symbolName));
    } else if ("url" in source) {
        // It's a { url }
        return OptionalWebImages.loadFromURLAsync(source.url, source.options);
    } else {
        throw new Error(`Unknown Image source! ${JSON.stringify(source)}`);
    }
}
