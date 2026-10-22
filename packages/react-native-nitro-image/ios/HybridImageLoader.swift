//
//  HybridImageLoader.swift
//  NitroImage
//
//  Created by Marc Rousavy on 25.07.25.
//

import NitroModules
import UIKit

class HybridImageLoader: HybridImageLoaderSpec {
  typealias LoadFunc = () throws -> Promise<any HybridImageSpec>
  typealias LoadForSizeFunc = (_ targetPixelSize: CGSize) throws -> Promise<any HybridImageSpec>

  private let load: LoadFunc
  private let allowCaching: Bool
  // Optionally loads a smaller Image that still covers the given size, used when displaying it in a view
  private let loadForSize: LoadForSizeFunc?
  private var cachedResult: (any HybridImageSpec)? = nil

  // The Image loaded for views is only kept alive while at least one view displays it
  private var activeViews = Set<ObjectIdentifier>()
  private var viewImage: Promise<any HybridImageSpec>? = nil
  // The pixel size `viewImage` was loaded for, or `nil` if it is full resolution
  private var viewImageSize: CGSize? = nil

  init(load: @escaping LoadFunc, allowCaching: Bool = true, loadForSize: LoadForSizeFunc? = nil) {
    self.load = load
    self.allowCaching = allowCaching
    self.loadForSize = loadForSize
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
    DispatchQueue.runOnMain { [self, imageView] in
      activeViews.insert(viewID)
      let request = { [weak self, weak imageView] in
        // The view might have been dropped before it was laid out
        guard let self, let imageView, self.activeViews.contains(viewID) else { return }
        guard let promise = try? self.loadImage(forView: imageView) else { return }
        promise.then { [weak self] image in
          guard let image = image as? NativeImage else { return }
          DispatchQueue.runOnMain {
            // The view might have been dropped while we were loading
            guard let self, self.activeViews.contains(viewID) else { return }
            imageView.image = image.uiImage
          }
        }
      }
      if let customImageView = imageView as? CustomImageView {
        // Views can be attached before they are laid out, so wait for their size to know how large to load the Image
        customImageView.doOnLayout(request)
      } else {
        request()
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
        self.viewImageSize = nil
      }
      imageView.image = nil
    }
  }

  private func loadImage(forView imageView: UIImageView) throws -> Promise<any HybridImageSpec> {
    let scale = max(imageView.traitCollection.displayScale, 1)
    let pixelSize = CGSize(width: imageView.bounds.width * scale, height: imageView.bounds.height * scale)
    // We can only load a smaller Image if we know how to, and the view has a size
    let targetPixelSize = loadForSize != nil && pixelSize.width > 0 && pixelSize.height > 0 ? pixelSize : nil

    if allowCaching, let viewImage, Self.covers(viewImageSize, targetPixelSize) {
      // Share the (possibly still running) load, its Image is already large enough for this view
      return viewImage
    }
    let promise: Promise<any HybridImageSpec>
    if let loadForSize, let targetPixelSize {
      promise = try loadForSize(targetPixelSize)
    } else {
      promise = try load()
    }
    if allowCaching {
      viewImage = promise
      viewImageSize = targetPixelSize
    }
    return promise
  }

  private static func covers(_ loadedSize: CGSize?, _ targetSize: CGSize?) -> Bool {
    // A full resolution Image covers every view, and only a full resolution Image covers a full resolution request
    guard let loadedSize else { return true }
    guard let targetSize else { return false }
    return loadedSize.width >= targetSize.width && loadedSize.height >= targetSize.height
  }
}
