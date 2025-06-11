//
//  UIImage+memorySize.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 11.06.25.
//

extension UIImage {
    private var rgbaMemorySize: Int {
      let pixelWidth = Int(size.width * scale)
      let pixelHeight = Int(size.height * scale)
      let bytesPerPixel = 4

      return pixelWidth * pixelHeight * bytesPerPixel
    }

    private var cgImageMemorySize: Int? {
      guard let cgImage = cgImage else { return nil }
      return cgImage.bytesPerRow * cgImage.height
    }

    var memorySize: Int {
      return cgImageMemorySize ?? rgbaMemorySize
    }
}
