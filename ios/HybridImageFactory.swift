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
  /**
   * Load Image from URL
   */
  func loadFromURL(url urlString: String) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return Promise.async {
      let request = ImageRequest(url: url)
      let task = try await ImagePipeline.shared.imageTask(with: request)
      let uiImage = task.image
      return HybridImage(uiImage: uiImage)
    }
  }
}
