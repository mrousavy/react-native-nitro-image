//
//  ImagePipeline+imageTask.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Nuke

extension ImagePipeline {
  func imageTask(with request: any ImageRequestConvertible) async throws -> ImageResponse {
    return try await withUnsafeThrowingContinuation { continuation in
      ImagePipeline.shared.loadImage(with: request) { result in
        do {
          let result = try result.get()
          continuation.resume(returning: result)
        } catch {
          continuation.resume(throwing: error)
        }
      }
    }
  }
}
