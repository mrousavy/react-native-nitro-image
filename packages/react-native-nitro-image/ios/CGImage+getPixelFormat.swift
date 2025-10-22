//
//  CGImage+pixelFormat.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 22.10.25.
//

import Foundation
import CoreGraphics

extension CGImage {
  private var isLittleEndian: Bool {
    switch self.byteOrderInfo {
    case .orderDefault:
      // iOS uses little endian by default
      return true
    case .order16Little, .order32Little:
      return true
    case .order16Big, .order32Big:
      return false
    case .orderMask:
      fatalError(".orderMask is an unknown value for endianness!")
    @unknown default:
      fatalError("CGImage has unknown .byteOrderInfo!")
    }
  }
  
  var pixelFormat: PixelFormat {
    let alpha = self.alphaInfo

    if alpha == .premultipliedFirst || alpha == .first {
      return isLittleEndian ? .bgra : .argb
    } else if alpha == .premultipliedLast || alpha == .last {
      return isLittleEndian ? .abgr : .rgba
    }
    return .unknown
  }
}
