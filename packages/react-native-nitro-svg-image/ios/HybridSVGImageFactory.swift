//
//  HybridSVGImageFactory.swift
//  react-native-nitro-svg-image
//
//  Created by Marc Rousavy on 17.11.25.
//

import Foundation
import NitroImage
import NitroModules
import SVGKit

fileprivate class HybridImage: HybridImageSpec, NativeImage {
  let uiImage: UIImage
  init(uiImage: UIImage) {
    self.uiImage = uiImage
    super.init()
  }
}

class HybridSVGImageFactory: HybridSVGImageFactorySpec {
    func renderSVG(svgString: String, width: Double, height: Double) throws -> any HybridImageSpec {
        // Parse SVG from string
        guard let svgImage = SVGKImage(data: svgString.data(using: .utf8)) else {
            throw RuntimeError.error(withMessage: "Failed to parse SVG string")
        }

        // Set the desired size
        svgImage.size = CGSize(width: width, height: height)

        // Render to UIImage
        guard let uiImage = svgImage.uiImage else {
            throw RuntimeError.error(withMessage: "Failed to render SVG to UIImage")
        }

        // Return as HybridImage from NitroImage
        return HybridImage(uiImage: uiImage)
    }
}
