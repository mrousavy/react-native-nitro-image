import type { ImageLoader } from "react-native-nitro-image";
import { NitroModules } from "react-native-nitro-modules";

export const WebImageLoader = NitroModules.createHybridObject<ImageLoader>('WebImageLoader')
