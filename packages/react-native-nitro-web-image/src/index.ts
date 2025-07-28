import { NitroModules } from "react-native-nitro-modules";
import type { WebImageLoaderFactory } from "./specs/WebImageLoaderFactory.nitro";

export const WebImages = NitroModules.createHybridObject<WebImageLoaderFactory>('WebImageLoaderFactory')
