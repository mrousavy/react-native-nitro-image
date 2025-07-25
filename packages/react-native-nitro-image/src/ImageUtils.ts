import { NitroModules } from "react-native-nitro-modules";
import type { ImageUtils } from "./specs/ImageUtils.nitro";

const utils = NitroModules.createHybridObject<ImageUtils>("ImageUtils");

export const thumbHashToBase64String =
    utils.thumbHashToBase64String.bind(utils);

export const thumbHashFromBase64String =
    utils.thumbhashFromBase64String.bind(utils);
