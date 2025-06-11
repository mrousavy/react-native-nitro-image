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
  func toArrayBufferAsync() throws -> Promise<ArrayBufferHolder> {
    return Promise.async {
      return try self.toArrayBuffer()
    }
  }
  
  func resize(width: Double, height: Double) throws -> any HybridImageSpec {
    let targetSize = CGSize(width: width, height: height)
    
    let renderer = UIGraphicsImageRenderer(size: targetSize)
    let resizedImage = renderer.image { context in
      let targetRect = CGRect(origin: .zero, size: targetSize)
      uiImage.draw(in: targetRect)
    }
    return HybridImage(uiImage: resizedImage)
  }
  
  func resizeAsync(width: Double, height: Double) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.resize(width: width, height: height)
    }
  }
}
