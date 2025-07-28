//
//  HybridWebImageLoader.swift
//  NitroWebImage
//
//  Created by Marc Rousavy on 28.07.25.
//

import NitroModules
import SDWebImage
import NitroImage

class HybridWebImageLoader: HybridImageLoaderSpec {
  private let url: URL
  private let options: AsyncImageLoadOptions?

  init(url: URL, options: AsyncImageLoadOptions?) {
    self.url = url
    self.options = options
    super.init()
  }

  func loadImage() throws -> Promise<(any HybridImageSpec)> {
    return Promise.async {
      let webImageOptions = self.options?.toSDWebImageOptions() ?? []
      let uiImage = try await SDWebImageManager.shared.loadImage(with: self.url, options: webImageOptions)
      throw RuntimeError.error(withMessage: "I don't have the HybridImage type yet...")
    }
  }

  func requestImage(forView view: (any HybridNitroImageViewSpec)) throws {
    guard let view = view as? NativeImageView else { throw RuntimeError.error(withMessage: "Invalid view type!") }

    let webImageOptions = options?.toSDWebImageOptions() ?? []
    view.imageView.sd_setImage(with: url,
                               placeholderImage: nil,
                               options: webImageOptions,
                               context: nil)
  }

  func dropImage(forView view: (any HybridNitroImageViewSpec)) throws {
    // TODO: Do we need to reset the image here or not?
  }
}
