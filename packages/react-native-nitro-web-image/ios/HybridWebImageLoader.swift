//
//  HybridWebImageLoader.swift
//  NitroWebImage
//
//  Created by Marc Rousavy on 28.07.25.
//

import NitroModules
import SDWebImage
import NitroImage

fileprivate class HybridImage: HybridImageSpec, NativeImage {
  let uiImage: UIImage
  init(uiImage: UIImage) {
    self.uiImage = uiImage
    super.init()
  }
}

class HybridWebImageLoader: HybridImageLoaderSpec {
  private let url: URL
  private let options: AsyncImageLoadOptions?

  init(url: URL, options: AsyncImageLoadOptions?) {
    self.url = url
    self.options = options
    super.init()
  }

  func loadImage() throws -> Promise<(any HybridImageSpec)> {
    return Self.loadImage(url: self.url, options: self.options)
  }

  func requestImage(forView view: (any HybridNitroImageViewSpec)) throws {
    guard let view = view as? NativeImageView else { throw RuntimeError.error(withMessage: "Invalid view type!") }

    let webImageOptions = options?.toSDWebImageOptions() ?? []
    let webImageContext = options?.toSDWebImageContext()
    view.imageView.sd_setImage(with: url,
                               placeholderImage: view.imageView.image,
                               options: webImageOptions,
                               context: webImageContext)
  }

  func dropImage(forView view: (any HybridNitroImageViewSpec)) throws {
    // TODO: Do we need to reset the image here or not?
  }
  
  public static func loadImage(url: URL, options: AsyncImageLoadOptions?) -> Promise<any HybridImageSpec> {
    return Promise.async {
      let uiImage = try await SDWebImageManager.shared.loadImage(with: url,
                                                                 options: options)
      return HybridImage(uiImage: uiImage)
    }
  }
}
