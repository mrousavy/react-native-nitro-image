//
//  HybridImage.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import UIKit
import NitroModules

class HybridImage: HybridImageSpec {
  let uiImage: UIImage

  var width: Double {
    return uiImage.size.width
  }
  var height: Double {
    return uiImage.size.height
  }
  var memorySize: Int {
    return uiImage.memorySize
  }

  init(uiImage: UIImage) {
    self.uiImage = uiImage
  }
  
  func toArrayBuffer() throws -> ArrayBufferHolder {
    return try uiImage.toRawRgbaArrayBuffer()
  }
  func toArrayBufferAsync() throws -> Promise<ArrayBufferHolder> {
    return Promise.async {
      return try self.toArrayBuffer()
    }
  }
  
  func resize(width: Double, height: Double) throws -> any HybridImageSpec {
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
  
  func toThumbHash() throws -> ArrayBufferHolder {
    let thumbHash = imageToThumbHash(image: uiImage)
    return try ArrayBufferHolder.copy(data: thumbHash)
  }
  
  func toThumbHashAsync() throws -> Promise<ArrayBufferHolder> {
    return Promise.async {
      return try self.toThumbHash()
    }
  }
}
