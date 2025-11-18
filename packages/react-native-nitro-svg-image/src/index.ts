import { NitroModules } from "react-native-nitro-modules";
import type { SVGImageFactory } from "./specs/SvgImageFactory.nitro";

export const SVGImages =
    NitroModules.createHybridObject<SVGImageFactory>("SVGImageFactory");
