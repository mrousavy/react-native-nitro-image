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
      let task = try await ImagePipeline.shared.imageTask(with: request,
                                                          queue: self.queue)
      let uiImage = task.image
      return HybridImage(uiImage: uiImage)
    }
  }
}
