//
//  UIImage+fromRawPixelData.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 22.10.25.
//

import UIKit
import CoreGraphics
import NitroModules

extension CGBitmapInfo {
  init(pixelFormat: PixelFormat) throws {
    let alphaFirst = CGImageAlphaInfo.premultipliedFirst.rawValue
    let alphaLast  = CGImageAlphaInfo.premultipliedLast.rawValue
    let noneFirst  = CGImageAlphaInfo.noneSkipFirst.rawValue
    let noneLast   = CGImageAlphaInfo.noneSkipLast.rawValue
    let o32L       = CGBitmapInfo.byteOrder32Little.rawValue
    let o32B       = CGBitmapInfo.byteOrder32Big.rawValue

    switch pixelFormat {
    case .argb: self.init(rawValue: alphaFirst | o32B)   // ARGB
    case .bgra: self.init(rawValue: alphaFirst | o32L)   // BGRA
    case .abgr: self.init(rawValue: alphaLast  | o32L)   // ABGR
    case .rgba: self.init(rawValue: alphaLast  | o32B)   // RGBA

    case .xrgb: self.init(rawValue: noneFirst  | o32B)   // XRGB (opaque)
    case .bgrx: self.init(rawValue: noneFirst  | o32L)   // BGRX (opaque)
    case .xbgr: self.init(rawValue: noneLast   | o32L)   // XBGR (opaque)
    case .rgbx: self.init(rawValue: noneLast   | o32B)   // RGBX (opaque)

    case .rgb:
      // 24-bit formats are stored as plain sequential bytes - the 16/32-bit
      // byteOrder flags don't apply, so "no alpha, default order" is [R, G, B].
      self.init(rawValue: CGImageAlphaInfo.none.rawValue)
    case .bgr:
      // Core Graphics has no 24-bit BGR format - byteOrder32Little has no effect
      // on 24-bit data. Callers must expand BGR to 32-bit BGRX first.
      throw RuntimeError.error(withMessage: "Core Graphics does not support 24-bit BGR - expand the data to BGRX first!")

    case .unknown:
      throw RuntimeError.error(withMessage: "Cannot initialize CGBitmapInfo with .unknown PixelFormat!")
    }
  }
}

/**
 * Expands 3-byte [B, G, R] pixel data to 4-byte [B, G, R, 0xFF] (BGRX) pixel data,
 * because Core Graphics does not support any 24-bit BGR format.
 */
private func expandBGRToBGRX(_ bgr: ArrayBuffer, width: Int, height: Int) throws -> ArrayBuffer {
  let pixelCount = width * height
  guard bgr.size >= pixelCount * 3 else {
    throw RuntimeError.error(withMessage: "BGR buffer is too small! (Size: \(bgr.size), Expected: \(pixelCount * 3))")
  }
  let bgrx = ArrayBuffer.allocate(size: pixelCount * 4)
  let source = bgr.data
  let destination = bgrx.data
  for i in 0 ..< pixelCount {
    destination[i * 4]     = source[i * 3]     // B
    destination[i * 4 + 1] = source[i * 3 + 1] // G
    destination[i * 4 + 2] = source[i * 3 + 2] // R
    destination[i * 4 + 3] = 0xFF              // X (opaque)
  }
  return bgrx
}

extension CGDataProvider {
  static func fromArrayBuffer(_ arrayBuffer: ArrayBuffer) throws -> CGDataProvider {
    guard arrayBuffer.isOwner else {
      throw RuntimeError.error(withMessage: "Cannot create CGDataProvider from a non-owning ArrayBuffer! Copy the buffer first to make it owning.")
    }

    class ArrayBufferHolder {
      let arrayBuffer: ArrayBuffer
      init(arrayBuffer: ArrayBuffer) {
        self.arrayBuffer = arrayBuffer
      }
    }
    let holder = ArrayBufferHolder(arrayBuffer: arrayBuffer)
    let provider = CGDataProvider(dataInfo: Unmanaged.passRetained(holder).toOpaque(),
                                  data: arrayBuffer.data,
                                  size: arrayBuffer.size) { info, _, _ in
      guard let info else {
        fatalError("CGDataProvider releaseFunc called without a pointer to our ArrayBufferHolder!")
      }
      // Releases the value of ArrayBufferHolder by taking one retained count in ARC
      let _ = Unmanaged<ArrayBufferHolder>.fromOpaque(info).takeRetainedValue()
    }
    guard let provider else {
      throw RuntimeError.error(withMessage: "Failed to create CGDataProvider from ArrayBuffer! (Size: \(arrayBuffer.size))")
    }
    return provider
  }
}

extension UIImage {
  convenience init(fromRawPixelData data: RawPixelData) throws {
    let width = Int(data.width)
    let height = Int(data.height)
    let bitsPerComponent = 8

    var buffer = data.buffer.asOwning()
    var pixelFormat = data.pixelFormat
    if pixelFormat == .bgr {
      // Core Graphics has no 24-bit BGR format - expand to 32-bit BGRX first.
      buffer = try expandBGRToBGRX(buffer, width: width, height: height)
      pixelFormat = .bgrx
    }
    let bytesPerPixel = pixelFormat == .rgb ? 3 : 4
    let bytesPerRow = width * bytesPerPixel

    let dataProvider = try CGDataProvider.fromArrayBuffer(buffer)

    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = try CGBitmapInfo(pixelFormat: pixelFormat)

    guard let cg = CGImage(
      width: width,
      height: height,
      bitsPerComponent: bitsPerComponent,
      bitsPerPixel: bitsPerComponent * bytesPerPixel,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: bitmapInfo,
      provider: dataProvider,
      decode: nil,
      shouldInterpolate: false,
      intent: .defaultIntent
    ) else {
      throw RuntimeError.error(withMessage: "Failed to create CGImage from the given RawPixelData! (Size: \(data.buffer.size), Format: \(data.pixelFormat))")
    }

    self.init(cgImage: cg, scale: 1.0, orientation: .up)
  }
}
