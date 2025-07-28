// @ts-ignore The import doesn't work if built separately.
type WebImagesType = typeof import("react-native-nitro-web-image")["WebImages"];

let createWebImageLoader: WebImagesType["createWebImageLoader"] = () => {
    throw new Error(
        `Web Images are not supported because react-native-nitro-web-image is not installed!`,
    );
};
let loadFromURLAsync: WebImagesType["loadFromURLAsync"] = () => {
    throw new Error(
        `Web Images are not supported because react-native-nitro-web-image is not installed!`,
    );
};

export type OptionalAsyncOptions = Parameters<
    WebImagesType["loadFromURLAsync"]
>[1];

try {
    const WebImages = require("react-native-nitro-web-image")
        .WebImages as WebImagesType;
    createWebImageLoader = WebImages.createWebImageLoader.bind(WebImages);
    loadFromURLAsync = WebImages.loadFromURLAsync.bind(WebImages);
} catch {
    // react-native-nitro-web-image is not installed, so only local images are supported.
}

export const OptionalWebImages = { createWebImageLoader, loadFromURLAsync };
