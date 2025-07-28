import type { Image, ImageLoader } from "react-native-nitro-image";
import type { HybridObject } from "react-native-nitro-modules";

export type AsyncImagePriority = "low" | "default" | "high";

export interface AsyncImageLoadOptions {
    /**
     * Specifies the priority of the image download.
     * @default 'default'
     */
    priority?: AsyncImagePriority;

    /**
     * Forces a cache refresh even if the URL is changed.
     * Use this if you cannot make your URLs static.
     * @default false
     */
    forceRefresh?: boolean;

    /**
     * A custom cache key to use for the image. By default, the URL is used as a cache key.
     * For customized access control/caching, provide a custom cache key.
     * @default The URL of the image.
     */
    cacheKey?: string;

    /**
     * Allows the Image download to continue even when the app is backgrounded.
     * @default false
     */
    continueInBackground?: boolean;

    /**
     * Enable to allow untrusted SSL certificates.
     * @default false
     */
    allowInvalidSSLCertificates?: boolean;

    /**
     * Scales down larger images to respect the device's memory constraints (max. 60 MB, or 4096x4096)
     * @default false
     */
    scaleDownLargeImages?: boolean;

    /**
     * By default, cached images are queried from memory **asynchronously** to avoid UI lag.
     * If this flag is enabled, images are queried **synchronously** from memory.
     * @default false
     */
    queryMemoryDataSync?: boolean;
    /**
     * By default, cached images are queried from disk **asynchronously** to avoid UI lag.
     * If this flag is enabled, images are queried **synchronously** from disk.
     * @default false
     */
    queryDiskDataSync?: boolean;

    /**
     * By default, images are decoded from binary data to actual image representations.
     * Disabling this might speed up downloads, but could increase memory usage.
     * @default true
     */
    decodeImage?: boolean;
}

export interface WebImageFactory
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    createWebImageLoader(
        url: string,
        options?: AsyncImageLoadOptions,
    ): ImageLoader;
    loadImageAsync(
        url: string,
        options?: AsyncImageLoadOptions,
    ): Promise<Image>;
}
