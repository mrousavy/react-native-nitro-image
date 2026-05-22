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
  override init() {
    // Install our priority-aware memory cache as the shared SDImageCache class.
    // Setting this on the default config must happen before any SDImageCache
    // instance is constructed, so do it here on the factory's first init.
    SDImageCacheConfig.default.memoryCacheClass = PriorityMemoryCache.self
    // NOTE: deliberately small for demo/manual verification of priority eviction.
    // Big enough to hold a handful of decoded bitmaps so eviction is observable.
    // Restore to 64 * 1024 * 1024 for production defaults.
    SDImageCacheConfig.default.maxMemoryCost = 16 * 1024 * 1024
    super.init()
  }

  func loadFromURLAsync(url urlString: String, options: AsyncImageLoadOptions?) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }
    
    return HybridWebImageLoader.loadImage(url: url, options: options)
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
  
  func preload(url urlString: String) throws {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }
    SDWebImagePrefetcher.shared.prefetchURLs([url])
  }
}
