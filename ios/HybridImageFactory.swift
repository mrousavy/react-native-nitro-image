//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import Nuke

class HybridImageFactory: HybridImageFactorySpec {
  private let queue = DispatchQueue(label: "image-loader",
                                    qos: .default,
                                    attributes: .concurrent)
  
  /**
   * Load Image from URL
   */
  func loadFromURL(url urlString: String) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return Promise.async {
      let request = ImageRequest(url: url)
      let response = try await ImagePipeline.shared.imageTask(with: request,
                                                              queue: self.queue)
      let uiImage = response.image
      return HybridImage(uiImage: uiImage)
    }
  }
  
  /**
   * Load Image from resources
   */
  func loadFromResources(name: String) throws -> any HybridImageSpec {
    guard let uiImage = UIImage(named: name) else {
      throw RuntimeError.error(withMessage: "Image \"\(name)\" cannot be found in main resource bundle!")
    }
    return HybridImage(uiImage: uiImage)
  }
  
  /**
   * Load Image from SF Symbol Name
   */
  func loadFromSymbol(symbolName: String) throws -> any HybridImageSpec {
    guard let uiImage = UIImage(systemName: symbolName) else {
      throw RuntimeError.error(withMessage: "No Image with the symbol name \"\(symbolName)\" found!")
    }
    return HybridImage(uiImage: uiImage)
  }
  
  /**
   * Load Image from the given ArrayBuffer
   */
  func loadFromArrayBuffer(buffer: ArrayBufferHolder) throws -> (any HybridImageSpec) {
    let data = buffer.toData(copyIfNeeded: false)
    guard let uiImage = UIImage(data: data) else {
      throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
    }
    return HybridImage(uiImage: uiImage)
  }
}
