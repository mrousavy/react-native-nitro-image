//
//  UIImage+downsampled.swift
//  react-native-nitro-image
//

import ImageIO
import UIKit

extension UIImage {
  /**
   * Decodes the image in [source] with ImageIO, scaled down so it is no larger than needed
   * to cover [targetPixelSize]. Unlike resizing a `UIImage`, the full-resolution bitmap is never created.
   */
  static func downsampled(from source: CGImageSource, toCover targetPixelSize: CGSize) -> UIImage? {
    guard let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
          var width = properties[kCGImagePropertyPixelWidth] as? CGFloat,
          var height = properties[kCGImagePropertyPixelHeight] as? CGFloat else {
      return nil
    }
    // EXIF orientations 5-8 rotate by 90°, so the displayed width and height are swapped
    if let orientation = properties[kCGImagePropertyOrientation] as? UInt32, orientation >= 5 {
      swap(&width, &height)
    }
    let scale = min(1, max(targetPixelSize.width / width, targetPixelSize.height / height))
    let options: [CFString: Any] = [
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceCreateThumbnailWithTransform: true,
      kCGImageSourceShouldCacheImmediately: true,
      kCGImageSourceThumbnailMaxPixelSize: ceil(max(width, height) * scale),
    ]
    guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else {
      return nil
    }
    return UIImage(cgImage: cgImage)
  }
}
