//
//  CustomImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 12.01.26.
//

import Foundation
import UIKit

internal protocol ViewLifecycleDelegate: AnyObject {
  func willShow()
  func willHide()
}

internal class CustomImageView: UIImageView {
  internal weak var delegate: (any ViewLifecycleDelegate)? = nil {
    didSet {
      onVisibilityChanged(isVisible: self.isVisible)
    }
  }

  init() {
    super.init(image: nil)
    self.clipsToBounds = true
  }
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private var layoutCallbacks: [() -> Void] = []

  override func willMove(toWindow newWindow: UIWindow?) {
    super.willMove(toWindow: newWindow)
    onVisibilityChanged(isVisible: newWindow != nil)
  }

  /**
   * Calls [callback] once this view has a size - immediately if it already has one.
   */
  internal func doOnLayout(_ callback: @escaping () -> Void) {
    if bounds.isEmpty {
      layoutCallbacks.append(callback)
    } else {
      callback()
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    guard !bounds.isEmpty, !layoutCallbacks.isEmpty else { return }
    let callbacks = layoutCallbacks
    layoutCallbacks.removeAll()
    callbacks.forEach { $0() }
  }
  private func onVisibilityChanged(isVisible: Bool) {
    if isVisible {
      delegate?.willShow()
    } else {
      delegate?.willHide()
    }
  }
}
