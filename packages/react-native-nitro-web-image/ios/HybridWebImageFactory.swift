//
//  HybridWebImageFactory.swift
//  react-native-nitro-web-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import SDWebImage
import NitroImage

class HybridWebImageFactory: HybridWebImageFactorySpec {
  func loadFromURLAsync(url: String, options: AsyncImageLoadOptions?) throws -> Promise<any HybridImageSpec> {
    throw RuntimeError.error(withMessage: "Not yet implemented!")
  }

  private let queue = DispatchQueue(label: "image-loader",
                                    qos: .default,
                                    attributes: .concurrent)

  /**
   * Load Image from URL
   */
  func createWebImageLoader(url urlString: String, options: AsyncImageLoadOptions?) throws -> any HybridImageLoaderSpec {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return HybridWebImageLoader(url: url, options: options)
  }
}
