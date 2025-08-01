//
//  SDWebImageManager+loadImage.swift
//  NitroWebImage
//
//  Created by Marc Rousavy on 30.06.25.
//

import Foundation
import SDWebImage
import NitroModules

extension SDWebImageManager {
  func loadImage(with url: URL, options: AsyncImageLoadOptions?) async throws -> UIImage {
    let webImageOptions = options?.toSDWebImageOptions() ?? []
    let webImageContext = options?.toSDWebImageContext() ?? [:]
    
    return try await withUnsafeThrowingContinuation { continuation in
      self.loadImage(with: url, options: webImageOptions, context: webImageContext) { current, total, url in
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
