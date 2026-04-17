//
//  NativeImage.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import UIKit
import NitroModules

/**
 * A protocol that represents a native image.
 * This can be used to downcast from `HybridImageSpec`
 * which gives you a concrete `UIImage`.
 *
 * If you want to use other Images with Image Loaders or Image Views,
 * make sure your native image class conforms to this protocol.
 */
public protocol NativeImage {
  var uiImage: UIImage { get }
}

/**
 * Extension for `HybridObject`s that are `NativeImage`: we can bind `memorySize` to the `uiImage`'s memory size*
 */
extension HybridObject where Self: NativeImage {
  var memorySize: Int {
    return uiImage.memorySize
  }
}

public extension NativeImage {
  var width: Double { uiImage.size.width }
  var height: Double { uiImage.size.height }

  func toRawPixelData(allowGpu _: Bool?) throws -> RawPixelData {
    return try uiImage.toRawPixelData()
  }
  func toRawPixelDataAsync(allowGpu: Bool?) -> Promise<RawPixelData> {
    return Promise.async {
      return try self.toRawPixelData(allowGpu: allowGpu)
    }
  }

  func toEncodedImageData(format: ImageFormat, quality: Double?) throws -> EncodedImageData {
    return try uiImage.toEncodedImageData(format: format, quality: quality ?? 100)
  }

  func toEncodedImageDataAsync(format: ImageFormat, quality: Double?) -> Promise<EncodedImageData> {
    return Promise.async {
      return try self.toEncodedImageData(format: format, quality: quality)
    }
  }

  func rotate(degrees: Double, allowFastFlagRotation: Bool?) -> any HybridImageSpec {
    if allowFastFlagRotation == true,
       degrees.truncatingRemainder(dividingBy: 90) == 0,
       let cgImage = uiImage.cgImage {
      // Fast path: we can apply `orientation` instead
      let steps = Int(degrees / 90.0) // can be negative
      let newOrientation = uiImage.imageOrientation.rotated(byRightAngles: steps)
      let rotated = UIImage(cgImage: cgImage, scale: uiImage.scale, orientation: newOrientation)
      return HybridImage(uiImage: rotated)
    } else {
      // Slow path: we actually rotate using UIGraphicsImageRenderer.
      // Force scale=1 so output pixel dims match the rotated bounding box
      // (avoids UIScreen.main.scale default).
      //
      // Output canvas must be sized to the ROTATED bounding box, not the original
      // image. Using uiImage.size clips content when degrees % 180 != 0 (e.g., a
      // portrait rotated 90 degrees produces a landscape rect that extends
      // outside a portrait canvas).
      let radians = degrees * .pi / 180
      let width = uiImage.size.width
      let height = uiImage.size.height
      let outputWidth = abs(cos(radians)) * width + abs(sin(radians)) * height
      let outputHeight = abs(sin(radians)) * width + abs(cos(radians)) * height
      let outputSize = CGSize(width: outputWidth, height: outputHeight)

      let format = UIGraphicsImageRendererFormat()
      format.scale = 1
      let renderer = UIGraphicsImageRenderer(size: outputSize, format: format)
      let rotatedImage = renderer.image { context in
        // 1. Move to the center of the OUTPUT canvas so our origin is its center
        context.cgContext.translateBy(x: outputWidth / 2, y: outputHeight / 2)
        // 2. Rotate by the given radians
        context.cgContext.rotate(by: radians)
        // 3. Draw the Image offset by half the ORIGINAL frame so we counter our
        //    center origin from step 1. The rotated content now fills the
        //    output canvas exactly (tight bounding box).
        let rect = CGRect(x: -(width / 2),
                          y: -(height / 2),
                          width: width,
                          height: height)
        uiImage.draw(in: rect)
      }
      return HybridImage(uiImage: rotatedImage)
    }
  }
  func rotateAsync(degrees: Double, allowFastFlagRotation: Bool?) -> Promise<any HybridImageSpec> {
    return Promise.async {
      return self.rotate(degrees: degrees, allowFastFlagRotation: allowFastFlagRotation)
    }
  }

  func resize(width: Double, height: Double) throws -> any HybridImageSpec {
    guard width > 0 else {
      throw RuntimeError.error(withMessage: "Width cannot be less than 0! (width: \(width))")
    }
    guard height > 0 else {
      throw RuntimeError.error(withMessage: "Height cannot be less than 0! (height: \(height))")
    }
    let targetSize = CGSize(width: width, height: height)

    // Force scale=1 so output pixel dims == targetSize. Without a format,
    // UIGraphicsImageRenderer defaults to UIScreen.main.scale, producing a
    // bitmap of (width * scale, height * scale) pixels on 2x/3x devices while
    // uiImage.size still reports (width, height) in points. The encoded JPEG
    // then has the inflated pixel dimensions, which is surprising from JS
    // where Image.width/Image.height looked correct.
    let format = UIGraphicsImageRendererFormat()
    format.scale = 1
    let renderer = UIGraphicsImageRenderer(size: targetSize, format: format)
    let resizedImage = renderer.image { context in
      let targetRect = CGRect(origin: .zero, size: targetSize)
      uiImage.draw(in: targetRect)
    }
    return HybridImage(uiImage: resizedImage)
  }

  func resizeAsync(width: Double, height: Double) -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.resize(width: width, height: height)
    }
  }

  func crop(startX: Double, startY: Double, endX: Double, endY: Double) throws -> any HybridImageSpec {
    let targetWidth = endX - startX
    let targetHeight = endY - startY
    guard targetWidth > 0 else {
      throw RuntimeError.error(withMessage: "Width cannot be less than 0! (startX: \(startX) - endX: \(endX) = \(targetWidth))")
    }
    guard targetHeight > 0 else {
      throw RuntimeError.error(withMessage: "Height cannot be less than 0! (startY: \(startY) - endY: \(endY) = \(targetHeight))")
    }

    // Normalize the UIImage before cropping. Two reasons:
    //  1. When imageOrientation != .up (common for e.g. vision-camera's
    //     Photo.toImageAsync() output which uses UIImage(cgImage:, orientation:)),
    //     uiImage.size is in DISPLAY space but uiImage.cgImage is in SENSOR space.
    //     Our (startX, startY, endX, endY) rect is in display space, so calling
    //     cgImage.cropping(to:) directly crops the wrong region.
    //  2. When uiImage.scale != 1, cgImage pixel dims are (size * scale), which
    //     makes the rect mean something different from what the caller expects.
    // Drawing through a scale=1 renderer bakes orientation into pixels and
    // normalizes scale so cgImage and our rect agree.
    let normalized: UIImage
    if uiImage.imageOrientation == .up && uiImage.scale == 1 {
      normalized = uiImage
    } else {
      let format = UIGraphicsImageRendererFormat()
      format.scale = 1
      let renderer = UIGraphicsImageRenderer(size: uiImage.size, format: format)
      normalized = renderer.image { _ in
        uiImage.draw(at: .zero)
      }
    }
    guard let cgImage = normalized.cgImage else {
      throw RuntimeError.error(withMessage: "This image does not have an underlying .cgImage!")
    }

    // Use the actual crop size (targetWidth, targetHeight). Previously this was
    // CGSize(uiImage.size.width, uiImage.size.height), which made the rect the
    // whole image and produced "image minus origin offset" instead of a real crop.
    let targetRect = CGRect(x: startX, y: startY, width: targetWidth, height: targetHeight)
    guard let croppedCgImage = cgImage.cropping(to: targetRect) else {
      throw RuntimeError.error(withMessage: "Failed to crop CGImage to \(targetRect)!")
    }
    // Wrap with explicit scale=1 and .up orientation so downstream ops see
    // consistent state instead of inheriting UIImage defaults that drop metadata.
    let croppedUiImage = UIImage(cgImage: croppedCgImage, scale: 1, orientation: .up)
    return HybridImage(uiImage: croppedUiImage)
  }

  func cropAsync(startX: Double, startY: Double, endX: Double, endY: Double) -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.crop(startX: startX, startY: startY, endX: endX, endY: endY)
    }
  }

  func mirrorHorizontally() -> any HybridImageSpec {
    let mirrored = uiImage.withHorizontallyFlippedOrientation()
    return HybridImage(uiImage: mirrored)
  }

  func mirrorHorizontallyAsync() -> Promise<any HybridImageSpec> {
    return Promise.async {
      return mirrorHorizontally()
    }
  }

  private func saveImage(to path: String, format: ImageFormat, quality: Double) throws {
    let data = try uiImage.getData(in: format, quality: quality)
    guard let url = URL(string: path) else {
      throw RuntimeError.error(withMessage: "The given path \"\(path)\" is not a valid URL!")
    }
    try data.write(to: url)
  }

  func saveToFileAsync(path: String, format: ImageFormat, quality: Double?) -> Promise<Void> {
    return Promise.async(.utility) {
      try self.saveImage(to: path, format: format, quality: quality ?? 100.0)
    }
  }

  func saveToTemporaryFileAsync(format: ImageFormat, quality: Double?) -> Promise<String> {
    return Promise.async(.utility) {
      let tempDirectory = FileManager.default.temporaryDirectory
      let fileName = UUID().uuidString
      let file = tempDirectory.appendingPathComponent(fileName, conformingTo: format.toUTType())
      let path = file.absoluteString

      try self.saveImage(to: path, format: format, quality: quality ?? 100.0)
      return path
    }
  }

  func toThumbHash() throws -> ArrayBuffer {
    let thumbHash = imageToThumbHash(image: uiImage)
    return try ArrayBuffer.copy(data: thumbHash)
  }

  func toThumbHashAsync() -> Promise<ArrayBuffer> {
    return Promise.async {
      return try self.toThumbHash()
    }
  }

  func renderInto(image newImage: any HybridImageSpec, x: Double, y: Double, width: Double, height: Double) throws -> any HybridImageSpec {
    guard let newImage = newImage as? NativeImage else {
      throw RuntimeError.error(withMessage: "The given image (\(newImage)) is not a `NativeImage`!")
    }
    // 1. Prepare a UIImage rendered
    let renderer = UIGraphicsImageRenderer(size: uiImage.size,
                                           format: uiImage.imageRendererFormat)
    let renderedImage = renderer.image { context in
      // 2. Render our own image (copy)
      self.uiImage.draw(at: .zero)

      // 3. Render the new image into our copy
      let rect = CGRect(x: x, y: y, width: width, height: height)
      newImage.uiImage.draw(in: rect)
    }
    // 4. Wrap the resulting UIImage in a HybridImage
    return HybridImage(uiImage: renderedImage)
  }

  func renderIntoAsync(image newImage: any HybridImageSpec, x: Double, y: Double, width: Double, height: Double) -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.renderInto(image: newImage, x: x, y: y, width: width, height: height)
    }
  }
}
