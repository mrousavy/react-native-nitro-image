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

public extension NativeImage {
  var width: Double { uiImage.size.width }
  var height: Double { uiImage.size.height }

  var memorySize: Int { uiImage.memorySize }

  func toRawPixelData(allowGpu _: Bool?) throws -> RawPixelData {
    return try uiImage.toRawPixelData()
  }
  func toRawPixelDataAsync(allowGpu: Bool?) throws -> Promise<RawPixelData> {
    return Promise.async {
      return try self.toRawPixelData(allowGpu: allowGpu)
    }
  }

  func toEncodedImageData(format: ImageFormat, quality: Double?) throws -> EncodedImageData {
    return try uiImage.toEncodedImageData(format: format, quality: quality ?? 100)
  }

  func toEncodedImageDataAsync(format: ImageFormat, quality: Double?) throws -> Promise<EncodedImageData> {
    return Promise.async {
      return try self.toEncodedImageData(format: format, quality: quality)
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

    let renderer = UIGraphicsImageRenderer(size: targetSize)
    let resizedImage = renderer.image { context in
      let targetRect = CGRect(origin: .zero, size: targetSize)
      uiImage.draw(in: targetRect)
    }
    return HybridImage(uiImage: resizedImage)
  }

  func resizeAsync(width: Double, height: Double) throws -> Promise<any HybridImageSpec> {
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
    guard let cgImage = uiImage.cgImage else {
      throw RuntimeError.error(withMessage: "This image does not have an underlying .cgImage!")
    }

    let targetRect = CGRect(origin: CGPoint(x: startX, y: startY),
                            size: CGSize(width: uiImage.size.width, height: uiImage.size.height))
    guard let croppedCgImage = cgImage.cropping(to: targetRect) else {
      throw RuntimeError.error(withMessage: "Failed to crop CGImage to \(targetRect)!")
    }
    let croppedUiImage = UIImage(cgImage: croppedCgImage)
    return HybridImage(uiImage: croppedUiImage)
  }

  func cropAsync(startX: Double, startY: Double, endX: Double, endY: Double) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.crop(startX: startX, startY: startY, endX: endX, endY: endY)
    }
  }

  private func saveImage(to path: String, format: ImageFormat, quality: Double) throws {
    let data = try uiImage.getData(in: format, quality: quality)
    guard let url = URL(string: path) else {
      throw RuntimeError.error(withMessage: "The given path \"\(path)\" is not a valid URL!")
    }
    try data.write(to: url)
  }

  func saveToFileAsync(path: String, format: ImageFormat, quality: Double?) throws -> Promise<Void> {
    return Promise.async(.utility) {
      try self.saveImage(to: path, format: format, quality: quality ?? 100.0)
    }
  }

  func saveToTemporaryFileAsync(format: ImageFormat, quality: Double?) throws -> Promise<String> {
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

  func toThumbHashAsync() throws -> Promise<ArrayBuffer> {
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
  
  func renderIntoAsync(image newImage: any HybridImageSpec, x: Double, y: Double, width: Double, height: Double) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.renderInto(image: newImage, x: x, y: y, width: width, height: height)
    }
  }
}
