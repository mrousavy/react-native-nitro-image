//
//  HybridImageTypeFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules

class HybridImageFactory: HybridImageFactorySpec {
  /**
   * Load Image from URL
   */
  func loadFromURL(url urlString: String) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }
    
    return Promise.async {
      let data = try Data(contentsOf: url, options: .mappedIfSafe)
      guard let uiImage = UIImage(data: data) else {
        throw RuntimeError.error(withMessage: "Failed to load image from URL \"\(url)\"!")
      }
      
      return HybridImage(uiImage: uiImage)
    }
  }
}
