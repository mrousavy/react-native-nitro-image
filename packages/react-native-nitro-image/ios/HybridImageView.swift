//
//  HybridImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import NitroModules

class HybridImageView: HybridNitroImageViewSpec {
  let view = CustomImageView()
  private var resetImageBeforeLoad = false

  override init() {
    super.init()
    view.delegate = self
  }

  var resizeMode: ResizeMode? {
    didSet {
      Task { @MainActor in
        self.updateResizeMode()
      }
    }
  }
  var image: (Variant__any_HybridImageSpec___any_HybridImageLoaderSpec_)? = nil {
    didSet {
      Task { @MainActor in
        self.updateImage()
      }
    }
  }
  var recyclingKey: String? {
    didSet {
      resetImageBeforeLoad = recyclingKey != oldValue
    }
  }

  private func updateResizeMode() {
    let mode = resizeMode ?? .cover
    switch mode {
    case .cover:
      view.contentMode = .scaleAspectFill
    case .contain:
      view.contentMode = .scaleAspectFit
    case .stretch:
      view.contentMode = .scaleToFill
    case .center:
      view.contentMode = .center
    }
  }

  private func updateImage() {
    switch image {
    case .first(let hybridImageSpec):
      // Specific image
      guard let image = hybridImageSpec as? NativeImage else {
        fatalError("Can't set `image` to a type that doesn't conform to `NativeImage`!")
      }
      view.image = image.uiImage
    case .second:
      // Image Loader - trigger a load or drop
      didSetImageLoader()
    case nil:
      // No Image
      view.image = nil
    }
  }

  private func didSetImageLoader() {
    // An ImageLoader was set - trigger an update (load or drop)
    if view.isVisible {
      willShow()
    } else {
      willHide()
    }
  }
}

// Conform to `NativeImageView` so third-party consumers can cast it
extension HybridImageView: NativeImageView {
  var imageView: UIImageView { view }
}

// Implementation for "asynchronously" loading Images using ImageLoader
extension HybridImageView: ViewLifecycleDelegate {
  private var imageLoader: HybridImageLoaderSpec? {
    guard case let .second(hybridImageLoaderSpec) = image else { return nil }
    return hybridImageLoaderSpec
  }

  func willShow() {
    guard let imageLoader else { return }
    if resetImageBeforeLoad {
      view.image = nil
      resetImageBeforeLoad = false
    }
    try? imageLoader.requestImage(forView: self)
  }

  func willHide() {
    guard let imageLoader else { return }
    try? imageLoader.dropImage(forView: self)
  }
}

// Implementation to allow view recycling
extension HybridImageView: RecyclableView {
  func prepareForRecycle() {
    willHide()
    view.image = nil
  }
}

