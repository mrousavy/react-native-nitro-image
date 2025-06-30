import UIKit
import CoreGraphics
import NitroModules

extension UIImage {
  /**
   * Returns raw RGBA data of this UIImage
   */
  func toRawRgbaArrayBuffer() throws -> ArrayBufferHolder {
    guard let cg = self.cgImage else {
      throw RuntimeError.error(withMessage: "Failed to get Image's underlying cgImage!")
    }

    let width  = cg.width
    let height = cg.height
    let bytesPerPixel = 4
    let bytesPerRow   = bytesPerPixel * width
    let bitsPerComponent = 8

    // Allocate a Data buffer of the right size
    let totalSize = width * height * bytesPerPixel
    let arrayBuffer = ArrayBufferHolder.allocate(size: totalSize)

    // Create a RGB-premultiplied-last context (i.e. RGBA)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue

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
