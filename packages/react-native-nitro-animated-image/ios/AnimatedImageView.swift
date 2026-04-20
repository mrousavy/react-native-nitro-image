import Foundation
import UIKit
import SDWebImage

protocol AnimatedViewLifecycleDelegate: AnyObject {
  func willShow()
  func willHide()
}

class AnimatedImageView: SDAnimatedImageView {
  weak var delegate: (any AnimatedViewLifecycleDelegate)? = nil {
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
