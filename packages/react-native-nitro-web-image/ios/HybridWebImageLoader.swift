//
//  HybridWebImageLoader.swift
//  NitroWebImage
//
//  Created by Marc Rousavy on 28.07.25.
//

import NitroModules
import NitroImage
import SDWebImage

class HybridWebImageLoader: HybridWebImageLoaderSpec {
  private let url: URL
  private let options: AsyncImageLoadOptions?
  
  init(url: URL, options: AsyncImageLoadOptions?) {
    self.url = url
    self.options = options
  }
  
  func loadImage() throws -> Promise<(any HybridImageSpec)> {
    return Promise.rejected(withError: RuntimeError.error(withMessage: "Not yet implemented!"))
  }
  
  func requestImage(forView: (any HybridNitroImageViewSpec)) throws {
    throw RuntimeError.error(withMessage: "Not yet implemented!")
  }
  
  func dropImage(forView: (any HybridNitroImageViewSpec)) throws {
    throw RuntimeError.error(withMessage: "Not yet implemented!")
  }
}
