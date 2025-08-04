//
//  HybridImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import NitroModules

fileprivate protocol ViewLifecycleDelegate: AnyObject {
  func willShow()
  func willHide()
}

class CustomImageView: UIImageView {
  fileprivate weak var delegate: ViewLifecycleDelegate? = nil {
    didSet {
      onVisibilityChanged(isVisible: superview != nil)
    }
  }
  
  init() {
    super.init(image: nil)
  }
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func willMove(toSuperview newSuperview: UIView?) {
    super.willMove(toSuperview: newSuperview)
    onVisibilityChanged(isVisible: newSuperview != nil)
  }
  private func onVisibilityChanged(isVisible: Bool) {
    if isVisible {
      delegate?.willShow()
    } else {
      delegate?.willHide()
    }
  }
}

fileprivate extension UIView {
  var isVisible: Bool {
    return superview != nil
  }
}

class HybridImageView: HybridNitroImageViewSpec, NativeImageView {
  let imageView: UIImageView
  let view: UIView
  private var resetImageBeforeLoad = false
  
  override init() {
    let imageView = CustomImageView()
    self.imageView = imageView
    self.view = imageView
    super.init()
    imageView.delegate = self
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
      imageView.contentMode = .scaleAspectFill
    case .contain:
      imageView.contentMode = .scaleAspectFit
    case .stretch:
      imageView.contentMode = .scaleToFill
    case .center:
      imageView.contentMode = .center
    }
  }
  
  private func updateImage() {
    switch image {
    case .first(let hybridImageSpec):
      // Specific image
      guard let image = hybridImageSpec as? NativeImage else {
        fatalError("Can't set `image` to a type that doesn't conform to `NativeImage`!")
      }
      imageView.image = image.uiImage
    case .second:
      // Image Loader - trigger a load or drop
      didSetImageLoader()
    case nil:
      // No Image
      imageView.image = nil
    }
  }
  
  private func didSetImageLoader() {
    // An ImageLoader was set - trigger an update (load or drop)
    if imageView.isVisible {
      willShow()
    } else {
      willHide()
    }
  }
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
      imageView.image = nil
      resetImageBeforeLoad = false
    }
    try? imageLoader.requestImage(forView: self)
  }
  
  func willHide() {
    guard let imageLoader else { return }
    try? imageLoader.dropImage(forView: self)
  }
}

