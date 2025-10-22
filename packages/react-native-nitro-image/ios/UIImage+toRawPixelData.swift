//
//  UIImage+toRawPixelData.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 22.10.25.
//

import UIKit
import CoreGraphics
import NitroModules

extension UIImage {
  /**
   * Returns raw RGBA data of this UIImage (on iOS, BGRA)
   */
  func toRawPixelData() throws -> RawPixelData {
    guard let cg = self.cgImage else {
      throw RuntimeError.error(withMessage: "Failed to get Image's underlying cgImage!")
    }

    let width = cg.width
    let height = cg.height
    let bytesPerPixel = 4
    let bytesPerRow = bytesPerPixel * width
    let bitsPerComponent = 8
    
    let totalBytesSize = width * height * bytesPerPixel
    
    let is32Bit = cg.bitsPerComponent == 8 && cg.bitsPerPixel == 32
    let isTight = cg.bytesPerRow == width * bytesPerPixel
    if is32Bit, isTight,
       let cfData = cg.dataProvider?.data,
       let sourceData = CFDataGetBytePtr(cfData) {
      // FAST PATH: Perform a direct copy if it's tightly packed memory
      assert(CFDataGetLength(cfData) == totalBytesSize, "CFData is not the same length as our computed size!")
      let arrayBuffer = ArrayBuffer.allocate(size: totalBytesSize)
      memcpy(arrayBuffer.data, sourceData, totalBytesSize)

      // Pixel format is any 4-character format
      let format = cg.pixelFormat
      
      return RawPixelData(buffer: arrayBuffer,
                          width: Double(width),
                          height: Double(height),
                          pixelFormat: format)
    } else {
      // SLOW PATH: Perform a draw into a BGRA buffer.
      let arrayBuffer = ArrayBuffer.allocate(size: totalBytesSize)
      
      // Create a RGB-premultiplied-first context (that's BGRA on iOS)
      let colorSpace = CGColorSpaceCreateDeviceRGB()
      let bitmapInfo = CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
      
      guard let ctx = CGContext(
        data: arrayBuffer.data,
        width: width,
        height: height,
        bitsPerComponent: bitsPerComponent,
        bytesPerRow: bytesPerRow,
        space: colorSpace,
        bitmapInfo: bitmapInfo
      ) else {
        throw RuntimeError.error(withMessage: "Failed to create CGContext for \(width)x\(height) RGBA Image!")
      }
      
      // Draw the Image into the CGContext
      let rect = CGRect(x: 0, y: 0, width: width, height: height)
      ctx.draw(cg, in: rect)
      
      return RawPixelData(buffer: arrayBuffer,
                          width: Double(width),
                          height: Double(height),
                          pixelFormat: .bgra)
    }
  }
}
