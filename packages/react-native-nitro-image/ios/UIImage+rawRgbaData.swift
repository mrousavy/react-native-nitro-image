import UIKit
import CoreGraphics
import NitroModules

extension UIImage {
  /**
   * Returns raw RGBA data of this UIImage
   */
  func toRawRgbaArrayBuffer() throws -> ArrayBuffer {
    guard let cg = self.cgImage else {
      throw RuntimeError.error(withMessage: "Failed to get Image's underlying cgImage!")
    }

    let width = cg.width
    let height = cg.height
    let bytesPerPixel = 4
    let bytesPerRow = bytesPerPixel * width
    let bitsPerComponent = 8

    // Allocate a Data buffer of the right size
    let totalSize = width * height * bytesPerPixel
    let arrayBuffer = ArrayBuffer.allocate(size: totalSize)

    // Create a RGB-premultiplied-first context (aka ARGB)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGImageAlphaInfo.premultipliedFirst.rawValue

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

    return arrayBuffer
  }
}
