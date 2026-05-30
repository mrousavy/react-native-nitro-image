import Foundation
import UIKit
import NitroModules
import NitroImage

fileprivate class HybridImage: HybridImageSpec, NativeImage {
  let uiImage: UIImage
  init(uiImage: UIImage) {
    self.uiImage = uiImage
    super.init()
  }
}

class HybridBlurHashFactory: HybridBlurHashFactorySpec {
  func encode(image: any HybridImageSpec, componentsX: Double, componentsY: Double) throws -> String {
    guard let native = image as? NativeImage else {
      throw RuntimeError.error(withMessage: "The given image (\(image)) is not a `NativeImage` and cannot be encoded to a BlurHash!")
    }
    guard let hash = native.uiImage.encodeBlurhash(numberOfComponents: (Int(componentsX), Int(componentsY))) else {
      throw RuntimeError.error(withMessage: "Failed to encode BlurHash!")
    }
    return hash
  }

  func encodeAsync(image: any HybridImageSpec, componentsX: Double, componentsY: Double) throws -> Promise<String> {
    return Promise.async {
      return try self.encode(image: image, componentsX: componentsX, componentsY: componentsY)
    }
  }

  func decode(blurhash: String, width: Double, height: Double, punch: Double) throws -> any HybridImageSpec {
    let size = CGSize(width: width, height: height)
    guard let uiImage = UIImage(blurHash: blurhash, size: size, punch: Float(punch)) else {
      throw RuntimeError.error(withMessage: "The given BlurHash (\(blurhash)) is not a valid BlurHash!")
    }
    return HybridImage(uiImage: uiImage)
  }

  func decodeAsync(blurhash: String, width: Double, height: Double, punch: Double) throws -> Promise<any HybridImageSpec> {
    return Promise.async {
      return try self.decode(blurhash: blurhash, width: width, height: height, punch: punch)
    }
  }

  func clearCosineCache() throws {
    // No-op: the iOS BlurHash decoder has no cosine cache.
  }
}
