//
//  HybridImage.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import NitroModules

class HybridImage: HybridImageSpec {
  let uiImage: UIImage

  var width: Double {
    return uiImage.size.width
  }
  var height: Double {
    return uiImage.size.height
  }

  init(uiImage: UIImage) {
    self.uiImage = uiImage
  }
  
  func toArrayBuffer() throws -> ArrayBufferHolder {
    guard let data = uiImage.pngData() else {
      throw RuntimeError.error(withMessage: "Failed to convert UIImage to png data!")
    }
    return try ArrayBufferHolder.copy(data: data)
  }
}
