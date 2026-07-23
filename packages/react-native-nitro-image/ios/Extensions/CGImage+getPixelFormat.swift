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
      // The "default" byte order has big-endian semantics: components are stored
      // in memory in exactly the order alphaInfo names them - e.g. premultipliedLast
      // + orderDefault is physically [R, G, B, A] bytes. This is a property of the
      // Core Graphics format description, unrelated to the host CPU's endianness.
      return false
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
      // X___ - the padding byte is reported as alpha on purpose: Apple's decoders
      // and renderers fill it with 0xFF, so the bytes read correctly as opaque alpha,
      // and consumers don't need to special-case the X formats.
      return self.isLittleEndian ? .bgra : .argb
    case .noneSkipLast:
      // ___X - see above, reported as alpha on purpose.
      return self.isLittleEndian ? .abgr : .rgba
    case .none:
      // ___
      return self.isLittleEndian ? .bgr : .rgb
    default:
      return .unknown
    }
  }
}
