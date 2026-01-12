//
//  UIImage+getData.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 11.06.25.
//

import UIKit
import NitroModules

extension UIImage {
  /**
   * Convert/Compress this Image into the given `format`.
   * `quality` specifies compression quality from 0(most)...100(least).
   */
  func getData(in format: ImageFormat, quality: CGFloat) throws -> Data {
    switch format {
    case .jpg:
      guard quality >= 0 && quality <= 100 else {
        throw RuntimeError.error(withMessage: "Image quality has to be between 0 and 100! (Received: \(quality))")
      }
      let qualityNormalized = quality / 100.0
      guard let data = self.jpegData(compressionQuality: qualityNormalized) else {
        throw RuntimeError.error(withMessage: "Failed to compress \(size.width)x\(size.height) Image to JPEG! (Quality: \(quality))")
      }
      return data
    case .png:
      guard let data = self.pngData() else {
        throw RuntimeError.error(withMessage: "Failed to convert \(size.width)x\(size.height) Image to PNG!")
      }
      return data
    case .heic:
      guard #available(iOS 17.0, *) else {
        throw RuntimeError.error(withMessage: "HEIC writing is only available on iOS 17.0 or higher! " +
                                 "Check ImageUtils.supportsHeicWriting before calling this method.")
      }
      guard let data = self.heicData() else {
        throw RuntimeError.error(withMessage: "Failed to convert \(size.width)x\(size.height) Image to HEIC!")
      }
      return data
    }
  }
}
