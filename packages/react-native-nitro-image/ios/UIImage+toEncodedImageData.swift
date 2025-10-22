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
  private func toData(format: ImageFormat, quality: Double = 1.0) throws -> Data {
    switch format {
    case .jpg:
      guard let data = self.jpegData(compressionQuality: quality) else {
        throw RuntimeError.error(withMessage: "Failed to compress Image into JPEG data!")
      }
      return data
    case .png:
      guard let data = self.pngData() else {
        throw RuntimeError.error(withMessage: "Failed to convert Image to PNG data!")
      }
      return data
    }
  }
  
  /**
   * Returns encoded Image data of this Image (JPG, PNG, ...)
   */
  func toEncodedImageData(format: ImageFormat, quality: Double = 1.0) throws -> EncodedImageData {
    let data = try toData(format: format, quality: quality)
    let arrayBuffer = try ArrayBuffer.copy(data: data)
    return EncodedImageData(buffer: arrayBuffer,
                            width: self.size.width,
                            height: self.size.height,
                            imageFormat: format)
  }
}
