import type { HybridObject } from "react-native-nitro-modules";
import type { WebImageLoader } from "./WebImageLoader.nitro";


export interface WebImageLoaderFactory extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
  createWebImageLoader(url: string): WebImageLoader
}
