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
    // `UIImageView` defaults `contentMode` to `.scaleToFill` (= stretch), but
    // `resizeMode` is documented to default to `cover`. When the `resizeMode`
    // prop is omitted it is never marked dirty, so `HybridImageView.resizeMode`
    // never gets assigned and its `didSet` (which applies the mapping) never
    // runs - which means the default has to be applied here, at construction.
    self.contentMode = .scaleAspectFill
  }
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func willMove(toWindow newWindow: UIWindow?) {
    super.willMove(toWindow: newWindow)
    onVisibilityChanged(isVisible: newWindow != nil)
  }
  private func onVisibilityChanged(isVisible: Bool) {
    if isVisible {
      delegate?.willShow()
    } else {
      delegate?.willHide()
    }
  }
}
