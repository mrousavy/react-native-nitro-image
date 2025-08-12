import { NitroModules } from "react-native-nitro-modules";
import type {
    AsyncImageLoadOptions as NativeAsyncImageLoadOptions,
    WebImageFactory,
} from "./specs/WebImageFactory.nitro";
import type { Image, ImageLoader } from "react-native-nitro-image";

const WebImagesNative =
    NitroModules.createHybridObject<WebImageFactory>("WebImageFactory");

type AsyncImageLoadOptions = Omit<NativeAsyncImageLoadOptions, "cacheKey"> & {
    cacheKey: string;
};

function userOptionsToNativeOptions(
    options?: AsyncImageLoadOptions,
): NativeAsyncImageLoadOptions | undefined {
    if (options == null) {
        return undefined;
    }
    const cacheKey =
        options.cacheKey == null
            ? undefined
            : {
                  value: options.cacheKey,
              };
    return {
        ...options,
        cacheKey: cacheKey,
    };
}

function createWebImageLoader(
    url: string,
    options?: AsyncImageLoadOptions,
): ImageLoader {
    const nativeOptions = userOptionsToNativeOptions(options);
    return WebImagesNative.createWebImageLoader(url, nativeOptions);
}

function loadFromURLAsync(
    url: string,
    options?: AsyncImageLoadOptions,
): Promise<Image> {
    const nativeOptions = userOptionsToNativeOptions(options);
    return WebImagesNative.loadFromURLAsync(url, nativeOptions);
}

export const WebImages = {
    ...WebImagesNative,
    createWebImageLoader,
    loadFromURLAsync,
};
