import type { Image } from "./specs/Image.nitro";
import type { ImageLoader } from "./specs/ImageLoader.nitro";

export type OptionalAsyncOptions = Parameters<
    // @ts-ignore The import doesn't work if built separately.
    typeof import("react-native-nitro-web-image")["WebImages"]["loadImageAsync"]
>[1];

let createWebImageLoader = (
    _url: string,
    _options?: OptionalAsyncOptions,
): ImageLoader => {
    throw new Error(
        `Web Images are not supported because react-native-nitro-web-image is not installed!`,
    );
};
let loadImageAsync = (
    _url: string,
    _options?: OptionalAsyncOptions,
): Promise<Image> => {
    throw new Error(
        `Web Images are not supported because react-native-nitro-web-image is not installed!`,
    );
};

try {
    const { WebImages } = require("react-native-nitro-web-image");
    createWebImageLoader = WebImages.createWebImageLoader.bind(WebImages);
    loadImageAsync = WebImages.loadImageAsync.bind(WebImages);
} catch {
    // react-native-nitro-web-image is not installed, so only local images are supported.
}

export const OptionalWebImages = { createWebImageLoader, loadImageAsync };
