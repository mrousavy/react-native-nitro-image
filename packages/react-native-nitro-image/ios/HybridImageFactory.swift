//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import UniformTypeIdentifiers

class HybridImageFactory: HybridImageFactorySpec {
  /**
   * Create new blank Image
   */
  func createBlankImage(width: Double, height: Double, enableAlpha: Bool, fill: Color?) throws -> any HybridImageSpec {
    // 1. Prepare image config
    let size = CGSize(width: width, height: height)
    let format = UIGraphicsImageRendererFormat()
    format.opaque = !enableAlpha
    // 2. Create a new UIImage
    let uiImage = UIGraphicsImageRenderer(size: size, format: format).image { canvas in
      if let fill {
        // 3. If we have a fill, fill the screen with that color
        let color = fill.toUIColor()
        color.setFill()
        let wholeArea = CGRect(origin: .zero, size: size)
        canvas.fill(wholeArea)
      }
    }
    // 4. Wrap it in HybridImage
    return HybridImage(uiImage: uiImage)
  }

  func createBlankImageAsync(width: Double, height: Double, enableAlpha: Bool, fill: Color?) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.createBlankImage(width: width, height: height, enableAlpha: enableAlpha, fill: fill)
    }
  }

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
   * Load Image from the given raw ArrayBuffer data
   */
  func loadFromRawPixelData(data: RawPixelData, allowGpu _ : Bool?) throws -> any HybridImageSpec {
    let uiImage = try UIImage(fromRawPixelData: data)
    return HybridImage(uiImage: uiImage)
  }

  func loadFromRawPixelDataAsync(data: RawPixelData, allowGpu: Bool?) throws -> Promise<any HybridImageSpec> {
    let maybeBufferCopy = data.buffer.asOwning()
    let newData = RawPixelData(buffer: maybeBufferCopy,
                               width: data.width,
                               height: data.height,
                               pixelFormat: data.pixelFormat)
    return Promise.async {
      return try self.loadFromRawPixelData(data: newData, allowGpu: allowGpu)
    }
  }

  /**
   * Load Image from the given encoded ArrayBuffer data
   */
  func loadFromEncodedImageData(data: EncodedImageData) throws -> any HybridImageSpec {
    let copiedData = data.buffer.toData(copyIfNeeded: false)
    guard let uiImage = UIImage(data: copiedData) else {
      throw RuntimeError.error(withMessage: "The given ArrayBuffer could not be converted to a UIImage!")
    }
    return HybridImage(uiImage: uiImage)
  }

  func loadFromEncodedImageDataAsync(data: EncodedImageData) throws -> Promise<any HybridImageSpec> {
    let copiedData = data.buffer.toData(copyIfNeeded: true)
    return Promise.async {
      guard let uiImage = UIImage(data: copiedData) else {
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
