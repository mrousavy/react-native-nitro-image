//
//  UIImageOrientation+fromDegrees.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 11.06.25.
//

import UIKit
import NitroModules

extension UIImage.Orientation {
  private func rotated90CW() -> UIImage.Orientation {
    switch self {
      case .up:             return .right
      case .right:          return .down
      case .down:           return .left
      case .left:           return .up
      case .upMirrored:     return .rightMirrored
      case .rightMirrored:  return .downMirrored
      case .downMirrored:   return .leftMirrored
      case .leftMirrored:   return .upMirrored
      @unknown default:     return .right
    }
  }
  func rotated(byRightAngles k: Int) -> UIImage.Orientation {
    let t = ((k % 4) + 4) % 4
    var o = self
    for _ in 0..<t { o = o.rotated90CW() }
    return o
  }
}
