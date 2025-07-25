//
//  HybridImageView.swift
//  react-native-nitro-web-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit

class HybridImageView: HybridNitroImageViewSpec {
  let imageView = UIImageView(image: nil)
  var view: UIView { imageView }

  var resizeMode: ResizeMode? {
    didSet {
      let mode = resizeMode ?? .contain
      switch mode {
        case .cover:
            imageView.contentMode = .scaleAspectFill
            imageView.clipsToBounds = true
        case .contain:
            imageView.contentMode = .scaleAspectFit
        case .stretch:
            imageView.contentMode = .scaleToFill
        case .center:
            imageView.contentMode = .center
      }
      updateImage()
    }
  }

  var image: (any HybridImageSpec)? {
    didSet {
      updateImage()
    }
  }

  func updateImage() {
    guard let hybridImage = image as? HybridImage else { return }
    print("Updating ImageView's image...")

    print("Frame: \(imageView.frame)")
    imageView.image = hybridImage.uiImage
  }
}
