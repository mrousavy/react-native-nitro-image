//
//  UIView+isVisible.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 12.01.26.
//

import Foundation
import UniformTypeIdentifiers

extension ImageFormat {
  var isVisible: Bool {
    return superview != nil
  }
}
