//
//  AsyncImageLoadOptions+toSDWebImageOptions.swift
//  NitroWebImage
//
//  Created by Marc Rousavy on 30.06.25.
//

import Foundation
import SDWebImage

extension AsyncImageLoadOptions {
  func toSDWebImageOptions() -> SDWebImageOptions {
    var options: SDWebImageOptions = []

    switch priority {
    case 0: options.insert(.lowPriority)
    case 2: options.insert(.highPriority)
    default: break
    }

    if forceRefresh == true {
      options.insert(.refreshCached)
    }

    if continueInBackground == true {
      options.insert(.continueInBackground)
    }

    if allowInvalidSSLCertificates == true {
      options.insert(.allowInvalidSSLCertificates)
    }

    if scaleDownLargeImages == true {
      options.insert(.scaleDownLargeImages)
    }

    if queryMemoryDataSync == true {
      options.insert(.queryMemoryDataSync)
    }

    if queryDiskDataSync == true {
      options.insert(.queryDiskDataSync)
    }

    if decodeImage == false {
      options.insert(.avoidDecodeImage)
    }

    if progressive == true {
      options.insert(.progressiveLoad)
    }

    return options
  }

  func toSDWebImageContext() -> [SDWebImageContextOption: Any] {
    var context: [SDWebImageContextOption: Any] = [:]

    if let cacheKey {
      context[.cacheKeyFilter] = SDWebImageCacheKeyFilter { _ in
        return cacheKey
      }
    }

    return context
  }
}
