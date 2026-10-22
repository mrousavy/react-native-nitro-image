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

  // The Image loaded for views is only kept alive while at least one view displays it
  private var activeViews = Set<ObjectIdentifier>()
  private var viewImage: Promise<any HybridImageSpec>? = nil

  init(load: @escaping LoadFunc, allowCaching: Bool = true) {
    self.load = load
    self.allowCaching = allowCaching
  }

  func dispose() {
    self.cachedResult = nil
    self.viewImage = nil
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
    let viewID = ObjectIdentifier(imageView)
    DispatchQueue.runOnMain { [self] in
      activeViews.insert(viewID)
      guard let promise = try? loadImageForViews() else { return }
      promise.then { [weak self] image in
        guard let image = image as? NativeImage else { return }
        DispatchQueue.runOnMain {
          // The view might have been dropped while we were loading
          guard let self, self.activeViews.contains(viewID) else { return }
          imageView.image = image.uiImage
        }
      }
    }
  }

  func dropImage(forView view: any HybridNitroImageViewSpec) throws {
    guard let view = view as? NativeImageView else { return }
    let imageView = view.imageView
    DispatchQueue.runOnMain {
      self.activeViews.remove(ObjectIdentifier(imageView))
      if self.activeViews.isEmpty {
        // No view displays the Image anymore - release it
        self.viewImage = nil
      }
      imageView.image = nil
    }
  }

  private func loadImageForViews() throws -> Promise<any HybridImageSpec> {
    guard allowCaching else { return try load() }
    // Share one (possibly still running) load between all views that display this Image
    if let viewImage {
      return viewImage
    }
    let promise = try load()
    viewImage = promise
    return promise
  }
}
