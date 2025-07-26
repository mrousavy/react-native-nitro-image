import { useMemo } from "react";
import { loadImageFromThumbHash } from "./ImageFactory";
import { thumbHashFromBase64String } from "./ImageUtils";
import { NitroImage } from "./NitroImage";
import type { Image } from "./specs/Image.nitro";
import type { AsyncImageLoadOptions } from "./specs/ImageFactory.nitro";
import type { NitroImageViewProps } from "./specs/ImageView.nitro";
import type { StyleProp, ViewStyle } from "react-native";
import { useWebImage } from "./useWebImage";

interface ImagePlaceholder {
    image: Image;
}
interface ThumbHashPlaceholder {
    thumbHash: ArrayBuffer | string;
}
interface ViewPlaceholder {
    view: React.ReactElement;
}

export interface NitroWebImageProps extends Omit<NitroImageViewProps, "image"> {
    style?: StyleProp<ViewStyle>;
    url: string;
    options?: AsyncImageLoadOptions;
    placeholder?: ImagePlaceholder | ThumbHashPlaceholder | ViewPlaceholder;
}

/**
 * A renderable Image component that fetches the `Image` from the given URL,
 * optionally displaying the given `placeholder` while fetching the image.
 *
 * As soon as this image is mounted, it will begin loading the image from the given URL.
 */
export function NitroWebImage({
    url,
    options,
    placeholder,
    ...props
}: NitroWebImageProps) {
    const image = useWebImage(url, options);
    const placeholderImage = useMemo(() => {
        if (placeholder == null) {
            // We don't have a placeholder
            return undefined;
        } else if ("image" in placeholder) {
            // We have an in-memory Image as a placeholder
            return placeholder.image;
        } else if ("thumbHash" in placeholder) {
            // We have a thumbHash as a placeholder
            let thumbHash = placeholder.thumbHash;
            if (typeof thumbHash === "string") {
                // It's a base64 string - convert to ArrayBuffer first
                thumbHash = thumbHashFromBase64String(thumbHash);
            }
            return loadImageFromThumbHash(thumbHash);
        } else {
            // Unknown placeholder...
            return undefined;
        }
    }, [placeholder]);

    if (image == null) {
        // It's still loading
        if (placeholder == null) {
            // No placeholder was specified by the user
            return null;
        } else if (placeholderImage != null) {
            // We have a placeholder image (thumbhash?)
            return <NitroImage {...props} image={placeholderImage} />;
        } else if ("view" in placeholder) {
            // We have a custom view as a placeholder
            return placeholder.view;
        } else {
            // This should never be reached
            throw new Error(
                `An unsupported placeholder was specified! ${placeholder}`,
            );
        }
    } else {
        // It finished loading! Lets go
        return <NitroImage {...props} image={image} />;
    }
}
