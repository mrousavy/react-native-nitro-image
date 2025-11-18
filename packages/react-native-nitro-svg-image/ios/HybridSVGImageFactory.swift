//
//  HybridSVGImageFactory.swift
//  react-native-nitro-svg-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroImage
import NitroModules
import SDWebImage
import SVGKit

private class HybridImage: HybridImageSpec, NativeImage {
    let uiImage: UIImage
    init(uiImage: UIImage) {
        self.uiImage = uiImage
        super.init()
    }
}

class HybridSVGImageFactory: HybridSVGImageFactorySpec {
    func stringToImage(url urlString: String, options: AsyncImageLoadOptions?) throws
        -> any HybridImageSpec
    {
        // Use urlString as SVG string with SVGKit
        guard let svgImage = SVGKImage(data: urlString.data(using: .utf8)) else {
            throw RuntimeError.error(withMessage: "Failed to parse SVG string")
        }

        // Convert SVGKit image to UIImage
        guard let uiImage = svgImage.uiImage else {
            throw RuntimeError.error(withMessage: "Failed to convert SVGKit image to UIImage")
        }

        // Return as HybridImage
        return HybridImage(uiImage: uiImage)
    }
}
