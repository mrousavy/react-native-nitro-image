//
//  HybridImageLoader.swift
//  NitroImage
//
//  Created by Marc Rousavy on 25.07.25.
//

import NitroModules

class HybridImageLoader: HybridImageLoaderSpec {
  typealias LoadFunc = () throws -> Promise<any HybridImageSpec>

  private let load: LoadFunc
  private let allowCaching: Bool
  private var cachedResult: (any HybridImageSpec)? = nil

  init(load: @escaping LoadFunc, allowCaching: Bool = true) {
    self.load = load
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
    guard let view = view as? NativeImageView else { return }
    let imageView = view.imageView
    // Start a new request - this invalidates any request that is still in flight for this view.
    let tracker = view as? ImageRequestTracking
    let token = tracker?.beginImageRequest()

    try loadImage()
      .then { [weak tracker] image in
        guard let image = image as? NativeImage else { return }
        DispatchQueue.runOnMain {
          if let token {
            // The view might have been recycled or re-bound to a different image while we
            // were loading - in that case this result is stale and must not be applied.
            guard let tracker, tracker.isImageRequestValid(token) else { return }
          }
          imageView.image = image.uiImage
        }
      }
  }

  func dropImage(forView view: any HybridNitroImageViewSpec) throws {
    guard let view = view as? NativeImageView else { return }
    // Invalidate any in-flight request so it doesn't paint into the view after we cleared it.
    (view as? ImageRequestTracking)?.cancelImageRequest()

    DispatchQueue.runOnMain {
      view.imageView.image = nil
    }
  }
}
