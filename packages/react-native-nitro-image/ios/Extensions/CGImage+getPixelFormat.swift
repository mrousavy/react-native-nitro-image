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
    guard self.bitsPerComponent == 8, self.bitsPerPixel == 32 else {
      return .unknown
    }
    switch self.alphaInfo {
    case .premultipliedFirst, .first:
      // A___
      return self.isLittleEndian ? .bgra : .argb
    case .premultipliedLast, .last:
      // ___A
      return self.isLittleEndian ? .abgr : .rgba
    case .noneSkipFirst:
      // X___
      return self.isLittleEndian ? .bgra : .argb
    case .noneSkipLast:
      // ___X
      return self.isLittleEndian ? .abgr : .rgba
    case .none:
      // ___
      return self.isLittleEndian ? .bgr : .rgb
    default:
      return .unknown
    }
  }
}
