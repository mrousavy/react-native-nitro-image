//
//  ImagePipeline+imageTask.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import Nuke

extension ImagePipeline {
  func imageTask(with request: any ImageRequestConvertible, queue: DispatchQueue?) async throws -> ImageResponse {
    return try await withUnsafeThrowingContinuation { continuation in
      ImagePipeline.shared.loadImage(with: request,
                                     queue: queue,
                                     progress: { request, completed, total in
        print("On progress: \(completed)/\(total)")
      },
                                     completion: { result in
        do {
          let result = try result.get()
          continuation.resume(returning: result)
        } catch {
          continuation.resume(throwing: error)
        }
      })
    }
  }
}
