import Photos

#if DEBUG
private func withThrowingContinuation<T>(_ body: (CheckedContinuation<T, Error>) -> Void) async throws -> T {
    return try await withCheckedThrowingContinuation(body)
}
#else
private func withThrowingContinuation<T>(_ body: (CheckedContinuation<T, Error>) -> Void) async throws -> T {
    return try await withUnsafeThrowingContinuation(body)
}
#endif

@available(iOS 13.0, *)
extension PHImageManager {
    /// Asynchronously requests an image for the specified asset.
    /// - Parameters:
    ///   - asset: The asset whose image is requested.
    ///   - targetSize: The target size of the image.
    ///   - contentMode: The content mode for the image.
    ///   - options: Options for the image request.
    /// - Returns: The requested image.
    func requestImage(
        for asset: PHAsset,
        targetSize: CGSize,
        contentMode: PHImageContentMode,
        options: PHImageRequestOptions?
    ) async throws -> UIImage {
        return try await withThrowingContinuation { continuation in
            requestImage(
                for: asset,
                targetSize: targetSize,
                contentMode: contentMode,
                options: options
            ) { image, info in
                if let error = info?[PHImageErrorKey] as? Error {
                    continuation.resume(throwing: error)
                } else if let image = image {
                    continuation.resume(returning: image)
                } else {
                    continuation.resume(
                        throwing: NSError(
                            domain: "PHImageManager",
                            code: -1,
                            userInfo: [NSLocalizedDescriptionKey: "Failed to load image"]
                        )
                    )
                }
            }
        }
    }
    
    /// Asynchronously requests image data and orientation for the specified asset.
    /// - Parameters:
    ///   - asset: The asset whose image data is requested.
    ///   - options: Options for the image request.
    /// - Returns: A tuple containing the image data and its orientation.
    func requestImageDataAndOrientation(
        for asset: PHAsset,
        options: PHImageRequestOptions?
    ) async throws -> (data: Data, orientation: CGImagePropertyOrientation) {
        return try await withThrowingContinuation { continuation in
            requestImageDataAndOrientation(
                for: asset,
                options: options
            ) { data, _, orientation, info in
                if let error = info?[PHImageErrorKey] as? Error {
                    continuation.resume(throwing: error)
                } else if let data = data {
                    continuation.resume(returning: (data, orientation))
                } else {
                    continuation.resume(
                        throwing: NSError(
                            domain: "PHImageManager",
                            code: -1,
                            userInfo: [NSLocalizedDescriptionKey: "Failed to load image data"]
                        )
                    )
                }
            }
        }
    }
}

// MARK: - PHAsset Extension

extension PHAsset {
    /// Asynchronously fetches a PHAsset by its local identifier.
    /// - Parameter localIdentifier: The local identifier of the asset to fetch.
    /// - Returns: The fetched asset if found.
    static func fetchAsset(withLocalIdentifier localIdentifier: String) async throws -> PHAsset {
        return try await withThrowingContinuation { continuation in
            let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [localIdentifier], options: nil)
            if let asset = fetchResult.firstObject {
                continuation.resume(returning: asset)
            } else {
                continuation.resume(
                    throwing: NSError(
                        domain: "PHAsset",
                        code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Asset with ID \(localIdentifier) was not found!"]
                    )
                )
            }
        }
    }
}
