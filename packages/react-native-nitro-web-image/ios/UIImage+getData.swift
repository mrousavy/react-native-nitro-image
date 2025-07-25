//
//  UIImage+getData.swift
//  react-native-nitro-web-image
//
//  Created by Marc Rousavy on 11.06.25.
//

import UIKit

extension UIImage {
  func getData(in format: ImageFormat, quality: CGFloat) -> Data? {
    switch format {
    case .jpg:
      return self.jpegData(compressionQuality: quality)
    case .png:
      return self.pngData()
    }
  }
}
