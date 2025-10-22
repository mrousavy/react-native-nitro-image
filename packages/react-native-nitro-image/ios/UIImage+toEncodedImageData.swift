//
//  UIImage+toEncodedImageData.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 22.10.25.
//

import UIKit
import CoreGraphics
import NitroModules

extension UIImage {
  /**
   * Returns encoded Image data of this Image (JPG, PNG, ...)
   */
  func toEncodedImageData(format: ImageFormat, quality: Double = 1.0) throws -> EncodedImageData {
    let data = try getData(in: format, quality: quality)
    let arrayBuffer = try ArrayBuffer.copy(data: data)
    return EncodedImageData(buffer: arrayBuffer,
                            width: self.size.width,
                            height: self.size.height,
                            imageFormat: format)
  }
}
