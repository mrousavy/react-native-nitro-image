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
    switch rawPixelData.pixelFormat {
    case .abgr:
      self.init(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    case .argb:
      self.init(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)
    case .bgra:
      self.init(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    case .rgba:
      self.init(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)
    case .unknown:
      throw RuntimeError.error(withMessage: "Cannot initialize CGBitmapInfo with .unknown PixelFormat!")
    }
  }
}

extension UIImage {
  convenience init(fromRawPixelData data: RawPixelData) throws {
    let width = Int(data.width)
    let height = Int(data.height)
    let bytesPerPixel = 4
    let bytesPerRow = width * bytesPerPixel
    let bitsPerComponent = 8

    let buffer = data.buffer
    guard let provider = CGDataProvider(dataInfo: nil, data: buffer.data, size: buffer.size, releaseData: { _,_,_  in }) else {
      throw RuntimeError.error(withMessage: "Failed to create CGDataProvider from the given ArrayBuffer! (Size: \(buffer.size))")
    }

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
      provider: provider,
      decode: nil,
      shouldInterpolate: false,
      intent: .defaultIntent
    ) else {
      throw RuntimeError.error(withMessage: "Failed to create CGImage from the given RawPixelData! (Size: \(buffer.size), Format: \(data.pixelFormat))")
    }

    self.init(cgImage: cg, scale: 1.0, orientation: .up)
  }
}
