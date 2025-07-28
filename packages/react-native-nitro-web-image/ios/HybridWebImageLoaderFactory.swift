//
//  HybridWebImageLoaderFactory.swift
//  react-native-nitro-web-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import SDWebImage

class HybridWebImageLoaderFactory: HybridWebImageLoaderFactorySpec {
  private let queue = DispatchQueue(label: "image-loader",
                                    qos: .default,
                                    attributes: .concurrent)

  /**
   * Load Image from URL
   */
  func createWebImageLoader(url urlString: String, options: AsyncImageLoadOptions?) throws -> any HybridWebImageLoaderSpec {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }
    
    return HybridWebImageLoader(url: URL, options: options)
  }
}
