//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules

class HybridImageFactory: HybridImageFactorySpec {
  /**
   * Load Image from file path
   */
  func loadFromFile(filePath rawFilePath: String) throws -> any HybridImageSpec {
    // 1. Clean out the file:// prefix
    let filePath = rawFilePath.replacingOccurrences(of: "file://", with: "")
    // 2. Load UIImage from file
    guard let uiImage = UIImage(contentsOfFile: filePath) else {
      throw RuntimeError.error(withMessage: "Failed to read image from file \"\(filePath)\"!")
    }
    return HybridImage(uiImage: uiImage)
  }
  func loadFromFileAsync(filePath: String) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.loadFromFile(filePath: filePath)
    }
  }

  /**
   * Load Image from resources
   */
  func loadFromResources(name: String) throws -> any HybridImageSpec {
    guard let uiImage = UIImage(named: name) else {
      throw RuntimeError.error(withMessage: "Image \"\(name)\" cannot be found in main resource bundle!")
    }
    return HybridImage(uiImage: uiImage)
  }
  func loadFromResourcesAsync(name: String) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.loadFromResources(name: name)
    }
  }

  /**
   * Load Image from SF Symbol Name
   */
  func loadFromSymbol(symbolName: String) throws -> any HybridImageSpec {
    guard let uiImage = UIImage(systemName: symbolName) else {
      throw RuntimeError.error(withMessage: "No Image with the symbol name \"\(symbolName)\" found!")
    }
    return HybridImage(uiImage: uiImage)
  }

  /**
   * Load Image from the given ArrayBuffer
   */
  func loadFromArrayBuffer(buffer: ArrayBuffer) throws -> (any HybridImageSpec) {
    let data = buffer.toData(copyIfNeeded: false)
    guard let uiImage = UIImage(data: data) else {
      throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
    }
    return HybridImage(uiImage: uiImage)
  }
  func loadFromArrayBufferAsync(buffer: ArrayBuffer) throws -> Promise<any HybridImageSpec> {
    let data = buffer.toData(copyIfNeeded: true)
    return Promise.async {
      guard let uiImage = UIImage(data: data) else {
        throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
      }
      return HybridImage(uiImage: uiImage)
    }
  }

  func loadFromThumbHash(thumbhash: ArrayBuffer) throws -> any HybridImageSpec {
    let data = thumbhash.toData(copyIfNeeded: false)
    let uiImage = thumbHashToImage(hash: data)
    return HybridImage(uiImage: uiImage)
  }
  func loadFromThumbHashAsync(thumbhash: ArrayBuffer) throws -> Promise<any HybridImageSpec> {
    let data = thumbhash.toData(copyIfNeeded: true)
    return Promise.async {
      let uiImage = thumbHashToImage(hash: data)
      return HybridImage(uiImage: uiImage)
    }
  }
}
