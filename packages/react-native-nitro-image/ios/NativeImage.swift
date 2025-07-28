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
  
  func toArrayBuffer() throws -> ArrayBuffer {
    return try uiImage.toRawRgbaArrayBuffer()
  }
  func toArrayBufferAsync() throws -> Promise<ArrayBuffer> {
    return Promise.async {
      return try self.toArrayBuffer()
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
    guard let data = uiImage.getData(in: format, quality: quality) else {
      throw RuntimeError.error(withMessage: "Failed to get Image data in format \(format.stringValue) with quality \(quality)!")
    }
    guard let url = URL(string: path) else {
      throw RuntimeError.error(withMessage: "The given path \"\(path)\" is not a valid URL!")
    }
    try data.write(to: url)
  }

  func saveToFileAsync(path: String, format: ImageFormat, quality: Double) throws -> Promise<Void> {
    return Promise.async(.utility) {
      try self.saveImage(to: path, format: format, quality: quality)
    }
  }

  func saveToTemporaryFileAsync(format: ImageFormat, quality: Double) throws -> Promise<String> {
    return Promise.async(.utility) {
      let tempDirectory = FileManager.default.temporaryDirectory
      let fileName = UUID().uuidString
      let file = tempDirectory.appendingPathComponent(fileName, conformingTo: format.toUTType())
      let path = file.absoluteString

      try self.saveImage(to: path, format: format, quality: quality)
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
}
