import type { HybridObject } from "react-native-nitro-modules";
import type { Image, RawPixelData } from "./Image.nitro";

export interface ImageFactory
    extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
    /**
     * Synchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
     * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
     * @throws If the {@linkcode filePath} is invalid.
     * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
     */
    loadFromFile(filePath: string): Image;
    /**
     * Asynchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
     * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
     * @throws If the {@linkcode filePath} is invalid.
     * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
     */
    loadFromFileAsync(filePath: string): Promise<Image>;

    /**
     * Synchronously loads an {@linkcode Image} from the given resource-/system-name.
     * @param name The resource-/system-name of the image to load.
     * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
     * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
     */
    loadFromResources(name: string): Image;
    /**
     * Asynchronously loads an {@linkcode Image} from the given resource-/system-name.
     * @param name The resource-/system-name of the image to load.
     * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
     * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
     */
    loadFromResourcesAsync(name: string): Promise<Image>;

    /**
     * Synchronously loads an {@linkcode Image} from the given symbol name.
     * This is iOS only!
     * @param symbolName The symbol name of the image to load. On iOS, this is the SF Symbols Name.
     * @throws If no {@linkcode Image} symbol exists under the given {@linkcode symbolName}.
     * @platform iOS 13
     */
    loadFromSymbol(symbolName: string): Image;

    /**
     * Synchronously convert the given given **raw** {@linkcode ArrayBuffer} to an {@linkcode Image}.
     * @param data The {@linkcode RawPixelData} object carrying the **raw** RGB image data and describing it's format.
     * @throws If the given {@linkcode ArrayBuffer} is not a valid RGB buffer representing an {@linkcode Image}.
     */
    loadFromRawArrayBuffer(data: RawPixelData): Image;
    /**
     * Asynchronously convert the given given **raw** {@linkcode ArrayBuffer} to an {@linkcode Image}.
     * @param data The {@linkcode RawPixelData} object carrying the **raw** RGB image data and describing it's format.
     * @throws If the given {@linkcode ArrayBuffer} is not a valid RGB buffer representing an {@linkcode Image}.
     */
    loadFromRawArrayBufferAsync(data: RawPixelData): Promise<Image>;

    /**
     * Synchronously convert the given given **encoded** {@linkcode ArrayBuffer} to an {@linkcode Image}.
     * @param buffer The ArrayBuffer carrying the encoded Image data in any supported image format (JPG, PNG, ...)
     * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
     */
    loadFromEncodedArrayBuffer(buffer: ArrayBuffer): Image;
    /**
     * Asynchronously convert the given given **encoded** {@linkcode ArrayBuffer} to an {@linkcode Image}.
     * @param buffer The ArrayBuffer carrying the encoded Image data in any supported image format (JPG, PNG, ...)
     * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
     */
    loadFromEncodedArrayBufferAsync(buffer: ArrayBuffer): Promise<Image>;

    /**
     * Synchronously decodes the given {@linkcode thumbhash} (and {@linkcode ArrayBuffer})
     * into an {@linkcode Image}.
     * @param buffer The ArrayBuffer carrying the ThumbHash's data
     * @throws If the given {@linkcode thumbhash} is not a valid ThumbHash.
     */
    loadFromThumbHash(thumbhash: ArrayBuffer): Image;
    loadFromThumbHashAsync(thumbhash: ArrayBuffer): Promise<Image>;
}
