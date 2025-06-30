//
//  SDWebImageManager+loadImage.swift
//  NitroImage
//
//  Created by Marc Rousavy on 30.06.25.
//

import Foundation
import SDWebImage
import NitroModules

extension SDWebImageManager {
  func loadImage(with url: URL, options: SDWebImageOptions) async throws -> UIImage {
    return try await withUnsafeThrowingContinuation { continuation in
      self.loadImage(with: url, options: options) { current, total, url in
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
