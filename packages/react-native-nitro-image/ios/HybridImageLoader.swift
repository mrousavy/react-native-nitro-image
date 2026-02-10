//
//  HybridImageLoader.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import NitroModules

class HybridImageLoader: HybridImageLoaderSpec {
  typealias LoadFunc = () throws -> Promise<any HybridImageSpec>
  typealias RequestFunc = (_ for: any HybridNitroImageViewSpec) throws -> Void
  typealias DropFunc = (_ for: any HybridNitroImageViewSpec) throws -> Void

  private let load: LoadFunc
  private let requestImage: RequestFunc?
  private let dropImage: DropFunc?
  private let allowCaching: Bool
  private var cachedResult: (any HybridImageSpec)? = nil

  init(load: @escaping LoadFunc, allowCaching: Bool = true) {
    self.load = load
    self.requestImage = nil
    self.dropImage = nil
    self.allowCaching = allowCaching
  }
  init(load: @escaping LoadFunc,
       requestImage: @escaping RequestFunc,
       dropImage: @escaping DropFunc,
       allowCaching: Bool = true) {
    self.load = load
    self.requestImage = requestImage
    self.dropImage = dropImage
    self.allowCaching = allowCaching
  }

  func dispose() {
    self.cachedResult = nil
  }

  func loadImage() throws -> Promise<any HybridImageSpec> {
    if allowCaching {
      // We can cache the last loaded image in state, so future requests receive it instantly
      if let cachedResult {
        return .resolved(withResult: cachedResult)
      }
      return try load()
        .then { [weak self] image in
          guard let self else { return }
          self.cachedResult = image
        }
    } else {
      // We need to reload the Image each time.
      return try load()
    }
  }

  func requestImage(forView view: any HybridNitroImageViewSpec) throws {
    if let requestImage {
      // Custom requestImage(...) func supplied
      return try requestImage(view)
    } else {
      // Default: Load & set image.
      guard let view = view as? NativeImageView else { return }
      try loadImage()
        .then { image in
          guard let image = image as? NativeImage else { return }
          DispatchQueue.runOnMain {
            view.imageView.image = image.uiImage
          }
        }
    }
  }

  func dropImage(forView view: any HybridNitroImageViewSpec) throws {
    if let dropImage {
      // Custom dropImage(...) func supplied
      return try dropImage(view)
    } else {
      // Default: Set image to nil
      guard let view = view as? NativeImageView else { return }
      DispatchQueue.runOnMain {
        view.imageView.image = nil
      }
    }
  }
}
