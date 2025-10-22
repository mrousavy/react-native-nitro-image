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
  init(rawPixelData: RawPixelData) throws {
    let alphaFirst = CGImageAlphaInfo.premultipliedFirst.rawValue
    let alphaLast  = CGImageAlphaInfo.premultipliedLast.rawValue
    let noneFirst  = CGImageAlphaInfo.noneSkipFirst.rawValue
    let noneLast   = CGImageAlphaInfo.noneSkipLast.rawValue
    let o32L       = CGBitmapInfo.byteOrder32Little.rawValue
    let o32B       = CGBitmapInfo.byteOrder32Big.rawValue

    switch rawPixelData.pixelFormat {
    case .argb: self.init(rawValue: alphaFirst | o32B)   // ARGB
    case .bgra: self.init(rawValue: alphaFirst | o32L)   // BGRA
    case .abgr: self.init(rawValue: alphaLast  | o32L)   // ABGR
    case .rgba: self.init(rawValue: alphaLast  | o32B)   // RGBA

    case .xrgb: self.init(rawValue: noneFirst  | o32B)   // XRGB (opaque)
    case .bgrx: self.init(rawValue: noneFirst  | o32L)   // BGRX (opaque)
    case .xbgr: self.init(rawValue: noneLast   | o32L)   // XBGR (opaque)
    case .rgbx: self.init(rawValue: noneLast   | o32B)   // RGBX (opaque)

    case .rgb:  self.init(rawValue: CGImageAlphaInfo.none.rawValue | o32B) // 24-bit RGB
    case .bgr:  self.init(rawValue: CGImageAlphaInfo.none.rawValue | o32L) // 24-bit BGR

    case .unknown:
      throw RuntimeError.error(withMessage: "Cannot initialize CGBitmapInfo with .unknown PixelFormat!")
    }
  }
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
    let bytesPerPixel = 4
    let bytesPerRow = width * bytesPerPixel
    let bitsPerComponent = 8

    let dataProvider = try CGDataProvider.fromArrayBuffer(data.buffer)

    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = try CGBitmapInfo(rawPixelData: data)

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
