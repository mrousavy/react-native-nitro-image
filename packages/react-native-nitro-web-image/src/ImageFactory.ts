import { NitroModules } from "react-native-nitro-modules";
import type { ImageFactory } from "./specs/ImageFactory.nitro";

/**
 * A factory for loading and creating `Image` instances.
 */
const factory = NitroModules.createHybridObject<ImageFactory>("ImageFactory");

/**
 * Asynchronously loads an {@linkcode Image} from the given {@linkcode url}.
 * @param url The URL of the {@linkcode Image}. Must start with `https://...`
 * @throws If the {@linkcode url} is invalid.
 * @throws If the network request cannot be made.
 * @throws If the data at the given {@linkcode url} cannot be parsed as an {@linkcode Image}.
 */
export const loadImageFromURLAsync = factory.loadFromURLAsync.bind(factory);

/**
 * Synchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
 * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
 * @throws If the {@linkcode filePath} is invalid.
 * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
 */
export const loadImageFromFile = factory.loadFromFile.bind(factory);
/**
 * Asynchronously loads an {@linkcode Image} from the given {@linkcode filePath}.
 * @param filePath The file path of the {@linkcode Image}. Must contain a file extension.
 * @throws If the {@linkcode filePath} is invalid.
 * @throws If the data at the given {@linkcode filePath} cannot be parsed as an {@linkcode Image}.
 */
export const loadImageFromFileAsync = factory.loadFromFileAsync.bind(factory);

/**
 * Synchronously loads an {@linkcode Image} from the given resource-/system-name.
 * @param name The resource-/system-name of the image to load.
 * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
 * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
 */
export const loadImageFromResources = factory.loadFromResources.bind(factory);
/**
 * Asynchronously loads an {@linkcode Image} from the given resource-/system-name.
 * @param name The resource-/system-name of the image to load.
 * @throws If no {@linkcode Image} exists under the given {@linkcode name}.
 * @throws If the file under the given {@linkcode name} cannot be parsed as an {@linkcode Image}.
 */
export const loadImageFromResourcesAsync =
    factory.loadFromResourcesAsync.bind(factory);

/**
 * Synchronously loads an {@linkcode Image} from the given symbol name.
 * This is iOS only!
 * @param symbolName The symbol name of the image to load. On iOS, this is the SF Symbols Name.
 * @throws If no {@linkcode Image} symbol exists under the given {@linkcode symbolName}.
 * @platform iOS 13
 */
export const loadImageFromSymbol = factory.loadFromSymbol.bind(factory);

/**
 * Synchronously convert the given given {@linkcode ArrayBuffer} to an {@linkcode Image}.
 * @param buffer
 * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
 */
export const loadImageFromArrayBuffer =
    factory.loadFromArrayBuffer.bind(factory);
/**
 * Asynchronously convert the given given {@linkcode ArrayBuffer} to an {@linkcode Image}.
 * @param buffer
 * @throws If the given {@linkcode ArrayBuffer} is not a valid representation of an {@linkcode Image}.
 */
export const loadImageFromArrayBufferAsync =
    factory.loadFromArrayBufferAsync.bind(factory);

/**
 * Synchronously decodes the given {@linkcode thumbhash} to an {@linkcode Image}.
 * @param thumbhash The binary representation of the ThumbHash - a `ArrayBuffer`.
 * @throws If the given {@linkcode thumbhash} is not a valid ThumbHash.
 * @note If your thumbhash is a base64 string, use `thumbHashFromBase64String(...)`
 */
export const loadImageFromThumbHash = factory.loadFromThumbHash.bind(factory);

/**
 * Asynchronously decodes the given {@linkcode thumbhash} to an {@linkcode Image}.
 * @param thumbhash The binary representation of the ThumbHash - a `ArrayBuffer`.
 * @throws If the given {@linkcode thumbhash} is not a valid ThumbHash.
 * @note If your thumbhash is a base64 string, use `thumbHashFromBase64String(...)`
 */
export const loadImageFromThumbHashAsync =
    factory.loadFromThumbHashAsync.bind(factory);
