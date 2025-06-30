//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import SDWebImage

extension SDWebImageManager {
  func loadImage(with url: URL) async throws -> UIImage {
    return try await withUnsafeThrowingContinuation { continuation in
      self.loadImage(with: url) { current, total, url in
        print("\(url): Loaded \(current)/\(total) bytes")
      } completed: { image, data, error, cacheType, finished, url in
        if let image {
          continuation.resume(returning: image)
        } else {
          if let error {
            continuation.resume(throwing: error)
          } else {
            continuation.resume(throwing: RuntimeError.error(withMessage: "No Image or error was returned!"))
          }
        }
      }
    }
  }
}

class HybridImageFactory: HybridImageFactorySpec {
  private let queue = DispatchQueue(label: "image-loader",
                                    qos: .default,
                                    attributes: .concurrent)
  
  /**
   * Load Image from URL
   */
  func loadFromURLAsync(url urlString: String) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return Promise.async {
      let uiImage = try await SDWebImageManager.shared.loadImage(with: url)
      return HybridImage(uiImage: uiImage)
    }
  }
  
  /**
   * Load Image from file path
   */
  func loadFromFile(filePath: String) throws -> any HybridImageSpec {
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
  func loadFromArrayBuffer(buffer: ArrayBufferHolder) throws -> (any HybridImageSpec) {
    let data = buffer.toData(copyIfNeeded: false)
    guard let uiImage = UIImage(data: data) else {
      throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
    }
    return HybridImage(uiImage: uiImage)
  }
  func loadFromArrayBufferAsync(buffer: ArrayBufferHolder) throws -> Promise<any HybridImageSpec> {
    let data = buffer.toData(copyIfNeeded: true)
    return Promise.async {
      guard let uiImage = UIImage(data: data) else {
        throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
      }
      return HybridImage(uiImage: uiImage)
    }
  }
}
