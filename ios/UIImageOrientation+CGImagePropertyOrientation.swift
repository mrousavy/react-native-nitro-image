//
//  UIImageOrientation+dc.swift
//  Pods
//
//  Created by bgl gwyng on 7/17/25.
//

extension UIImage.Orientation {
  init(cgImageOrientation: CGImagePropertyOrientation) {
    switch cgImageOrientation {
    case .up: self = .up
    case .upMirrored: self = .upMirrored
    case .down: self = .down
    case .downMirrored: self = .downMirrored
    case .left: self = .left
    case .leftMirrored: self = .leftMirrored
    case .right: self = .right
    case .rightMirrored: self = .rightMirrored
    @unknown default: self = .up
    }
  }
}
