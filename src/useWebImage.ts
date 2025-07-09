import { useEffect, useState } from "react";
import { loadImageFromURLAsync } from "./ImageFactory";
import type { Image } from "./specs/Image.nitro";
import type { AsyncImageLoadOptions } from "./specs/ImageFactory.nitro";

/**
 * A convenience hook to load a remote image from the given {@linkcode url}.
 */
export function useWebImage(
	url: string,
	options?: AsyncImageLoadOptions,
): Image | undefined {
	const [image, setImage] = useState<Image | undefined>(undefined);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `options` is missing from dependencies since it's a reference type that will be constructed each render.
	useEffect(() => {
		const load = async () => {
			try {
				const i = await loadImageFromURLAsync(url, options);
				setImage(i);
			} catch (error) {
				console.error(`Failed to load image from "${url}"!`, error);
				setImage(undefined);
			}
		};
		load();
	}, [url]);

	return image;
}
