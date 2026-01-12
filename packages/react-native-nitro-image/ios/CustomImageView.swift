//
//  CustomImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 12.01.26.
//

import Foundation
import UIKit
import NitroModules

class CustomImageView: UIImageView {
  fileprivate weak var delegate: ViewLifecycleDelegate? = nil {
    didSet {
      onVisibilityChanged(isVisible: self.isVisible)
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
