// The MIT License (MIT)
//
// Copyright (c) 2015-2024 Alexander Grebenyuk (github.com/kean).

#if canImport(UIKit)
import UIKit
#endif

#if canImport(AppKit)
import AppKit
#endif

import ImageIO

// MARK: - ImageEncoding

/// An image encoder.
internal protocol ImageEncoding: Sendable {
    /// Encodes the given image.
    func encode(_ image: PlatformImage) -> Data?

    /// An optional method which encodes the given image container.
    func encode(_ container: ImageContainer, context: ImageEncodingContext) -> Data?
}

extension ImageEncoding {
    internal func encode(_ container: ImageContainer, context: ImageEncodingContext) -> Data? {
        if container.type == .gif {
            return container.data
        }
        return self.encode(container.image)
    }
}

/// Image encoding context used when selecting which encoder to use.
internal struct ImageEncodingContext: @unchecked Sendable {
    internal let request: ImageRequest
    internal let image: PlatformImage
    internal let urlResponse: URLResponse?
}
