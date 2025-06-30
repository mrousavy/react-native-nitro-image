//
//  AsyncImageLoadOptions+toSDWebImageOptions.swift
//  NitroImage
//
//  Created by Marc Rousavy on 30.06.25.
//

import Foundation
import SDWebImage

extension AsyncImageLoadOptions {
  func toSDWebImageOptions() -> SDWebImageOptions {
    var options: SDWebImageOptions = []
    
    switch priority {
    case .default, .none:
      break
    case .low:
      options.insert(.lowPriority)
    case .high:
      options.insert(.highPriority)
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
    
    return options
  }
}
