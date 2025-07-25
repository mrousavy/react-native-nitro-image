//
//  HybridImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import SDWebImage
import NitroModules

protocol ViewEventListener {
  func willShow()
  func willHide()
}

protocol NativeImageView {
  var imageView: UIImageView { get }
}

class CustomImageView: UIImageView {
  private var listeners: [ViewEventListener] = []
  
  init() {
    super.init(image: nil)
  }
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func addListener(listener: ViewEventListener) {
    listeners.append(listener)
  }
  
  override func willMove(toSuperview newSuperview: UIView?) {
    if superview == nil {
      listeners.forEach { $0.willHide() }
    } else {
      listeners.forEach { $0.willShow() }
    }
  }
}

class HybridImageView: HybridNitroImageViewSpec, NativeImageView {
  let imageView: UIImageView = CustomImageView()
  var view: UIView { imageView }
  
  // TODO: REMOVE
  var image: (any HybridImageSpec)? = nil

  var resizeMode: ResizeMode? {
    didSet {
      let mode = resizeMode ?? .contain
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
  }
  
  func addListener(listener: ViewEventListener) {
    (imageView as! CustomImageView).addListener(listener: listener)
  }
}

