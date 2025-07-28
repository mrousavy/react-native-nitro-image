//
//  HybridImage.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import NitroModules

class HybridImage: HybridImageSpec, NativeImage {
  let uiImage: UIImage

  var width: Double {
    return uiImage.size.width
  }
  var height: Double {
    return uiImage.size.height
  }
  var memorySize: Int {
    return uiImage.memorySize
  }

  init(uiImage: UIImage) {
    self.uiImage = uiImage
  }
}
