import type { HybridObject } from "react-native-nitro-modules";

export interface ImageUtils
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    /**
     * Returns `true` when the host platform supports loading Images
     * in `HEIC` format.
     */
    readonly supportsHeicLoading: boolean;
    /**
     * Returns `true` when the host platform supports writing Images
     * in `HEIC` format.
     */
    readonly supportsHeicWriting: boolean;

    /**
     * Converts the given ThumbHash {@linkcode ArrayBuffer} to a `string`.
     */
    thumbHashToBase64String(thumbhash: ArrayBuffer): string;
    /**
     * Converts the given ThumbHash `string` to an {@linkcode ArrayBuffer}.
     */
    thumbhashFromBase64String(thumbhashBase64: string): ArrayBuffer;
}
