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
        let requestOptions = PHImageRequestOptions()
        requestOptions.version = .current
        requestOptions.deliveryMode = .highQualityFormat
        requestOptions.isNetworkAccessAllowed = true
        
        
        if let size = options?.size {
          let contentMode: PHImageContentMode
          if let aspectFit = options?.aspectFit {
            switch aspectFit {
            case .fit:
              contentMode = .aspectFit
            case .fill:
              contentMode = .aspectFill
            }
          } else {
            contentMode = .default
          }
          
          PHImageManager.default().requestImage(
            for: asset,
            targetSize: CGSize(width: size.width, height: size.height),
            contentMode: contentMode,
            options: requestOptions
          ) { (image, info) in
            if let error = info?[PHImageErrorKey] as? Error {
              continuation.resume(throwing: error)
            } else if let image = image {
              continuation
                .resume(returning: HybridImage(uiImage: image))
            } else {
              continuation.resume(
                throwing: RuntimeError.error(withMessage: "Failed to load or convert image")
              )
            }
          }
        } else {
          PHImageManager.default().requestImageDataAndOrientation(
            for: asset,
            options: requestOptions
          ) { (imageData, dataUTI, orientation, info) in
            
            if let error = info?[PHImageErrorKey] as? Error {
              continuation.resume(throwing: error)
            } else if let imageData = imageData,
                      let cgImage = UIImage(data:imageData)?.cgImage                       {
              let uiImageOrientation: UIImage.Orientation
              switch orientation {
              case .up: uiImageOrientation = .up
              case .upMirrored: uiImageOrientation = .upMirrored
              case .down: uiImageOrientation = .down
              case .downMirrored: uiImageOrientation = .downMirrored
              case .left: uiImageOrientation = .left
              case .leftMirrored: uiImageOrientation = .leftMirrored
              case .right: uiImageOrientation = .right
              case .rightMirrored: uiImageOrientation = .rightMirrored
              }
              let uiImage = UIImage(cgImage: cgImage, scale: 1, orientation:uiImageOrientation )
              continuation.resume(returning: HybridImage(uiImage: uiImage))
            } else {
              continuation.resume(
                throwing: RuntimeError.error(withMessage: "Failed to load or convert image")
              )
            }
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
