import type { Image } from "react-native-nitro-image";
import type { HybridObject } from "react-native-nitro-modules";

/**
 * Factory for rendering SVG strings into bitmap Images.
 */
export interface SVGImageFactory
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    /**
     * Synchronously renders an SVG string to a bitmap {@linkcode Image}.
     * @param svgString The SVG content as a string
     * @param width Target width in pixels
     * @param height Target height in pixels
     * @throws If the SVG string is invalid or cannot be parsed
     * @example
     * ```ts
     * const svg = '<svg width="100" height="100">...</svg>'
     * const image = svgFactory.renderSVG(svg, 200, 200)
     * ```
     */
    renderSVG(svgString: string, width: number, height: number): Image;
}
