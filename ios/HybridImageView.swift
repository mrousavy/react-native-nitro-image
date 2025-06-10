//
//  HybridImageView.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit

class HybridImageView: HybridNitroImageViewSpec {
  let imageView = UIImageView(image: nil)
  var view: UIView { imageView }
  
  var image: (any HybridImageSpec)? {
    didSet {
      updateImage()
    }
  }
  
  func updateImage() {
    guard let hybridImage = image as? HybridImage else { return }
    print("Updating ImageView's image...")
    imageView.image = hybridImage.uiImage
  }
}
