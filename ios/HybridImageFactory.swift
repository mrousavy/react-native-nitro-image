//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import SDWebImage

class HybridImageFactory: HybridImageFactorySpec {
  private let downloader = SDWebImageDownloader.shared
  
  /**
   * Load Image from URL
   */
  func loadFromURL(url urlString: String) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return Promise.async {
      throw RuntimeError.error(withMessage: "Not implemented")
    }
  }
}
