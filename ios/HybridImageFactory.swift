//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import SDWebImage
import Photos

class HybridImageFactory: HybridImageFactorySpec {
  private let queue = DispatchQueue(label: "image-loader",
                                    qos: .default,
                                    attributes: .concurrent)
  
  /**
   * Load Image from URL
   */
  func loadFromURLAsync(url urlString: String, options: AsyncImageLoadOptions?) throws -> Promise<any HybridImageSpec> {
    guard let url = URL(string: urlString) else {
      throw RuntimeError.error(withMessage: "URL string \"\(urlString)\" is not a valid URL!")
    }

    return Promise.async {
      let webImageOptions = options?.toSDWebImageOptions() ?? []
      let uiImage = try await SDWebImageManager.shared.loadImage(with: url, options: webImageOptions)
      return HybridImage(uiImage: uiImage)
    }
  }
  
  /**
   * Load Image from URL
   */
  func loadFromAssetAsync(assetId: String, options: AssetImageLoadOptions?) throws -> Promise<any HybridImageSpec> {
    let assets = PHAsset.fetchAssets(
      withLocalIdentifiers: [assetId],
      options: nil
    )
    guard let asset = assets.firstObject else {
      throw NSError(
        domain: "TurboImageView",
        code: 404,
        userInfo: [NSLocalizedDescriptionKey: "Asset not found"]
      )
    }
    
    return Promise.async {
      return try await withCheckedThrowingContinuation { continuation in
        let options = PHImageRequestOptions()
        options.version = .current
        options.deliveryMode = .highQualityFormat
        options.isNetworkAccessAllowed = true
        
        let size = CGSize(width: 400, height: 400)
        
        // Request resized image
        PHImageManager.default().requestImage(
          for: asset,
          targetSize: size,
          contentMode: .aspectFit,
          options: options
        ) { (image, info) in
          if let error = info?[PHImageErrorKey] as? Error {
            continuation.resume(throwing: error)
          } else if let image = image,
                    let imageData = image.pngData() ?? image.jpegData(
                      compressionQuality: 0.9
                    ) {
            continuation
              .resume(returning: HybridImage(uiImage: image))
          } else {
            continuation.resume(
              throwing: NSError(
                domain: "TurboImageView",
                code: 500,
                userInfo: [NSLocalizedDescriptionKey: "Failed to load or convert image"]
              )
            )
          }
        }
      }
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
  
  func loadFromThumbHash(thumbhash: ArrayBufferHolder) throws -> any HybridImageSpec {
    let data = thumbhash.toData(copyIfNeeded: false)
    let uiImage = thumbHashToImage(hash: data)
    return HybridImage(uiImage: uiImage)
  }
  func loadFromThumbHashAsync(thumbhash: ArrayBufferHolder) throws -> Promise<any HybridImageSpec> {
    let data = thumbhash.toData(copyIfNeeded: true)
    return Promise.async {
      let uiImage = thumbHashToImage(hash: data)
      return HybridImage(uiImage: uiImage)
    }
  }
}
