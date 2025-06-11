//
//  ImageFormat+toUTType.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 11.06.25.
//

import Foundation
import UniformTypeIdentifiers

extension ImageFormat {
  func toUTType() -> UTType {
    switch self {
    case .jpg:
      return .jpeg
    case .png:
      return .png
    }
  }
}
