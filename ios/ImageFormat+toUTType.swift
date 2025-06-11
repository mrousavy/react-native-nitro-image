//
//  ImageFormat+toUTType.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 11.06.25.
//

import Foundation

extension ImageFormat {
  func toUTType() -> UTType {
    switch format {
    case .jpg:
      return .jpg
    case .png:
      return .png
    }
  }
}
