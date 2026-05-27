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

  // Without this, we get this error: error: type 'HybridImage' cannot conform to protocol 'HybridImageSpec_protocol'
  // because it has requirements that cannot be satisfied
  func saveToFileAsync(path: String, format: ImageFormat, quality: Double?) throws -> Promise<Void> { fatalError("stub") }
  func saveToTemporaryFileAsync(format: ImageFormat, quality: Double?) throws -> Promise<String> { fatalError("stub") }
}

class HybridThumbHashFactory: HybridThumbHashFactorySpec {
  func encode(image: any HybridImageSpec) throws -> ArrayBuffer {
    guard let native = image as? NativeImage else {
      throw RuntimeError.error(withMessage: "The given image (\(image)) is not a `NativeImage` and cannot be encoded to a ThumbHash!")
    }
    let data = imageToThumbHash(image: native.uiImage)
    return try ArrayBuffer.copy(data: data)
  }

  func encodeAsync(image: any HybridImageSpec) throws -> Promise<ArrayBuffer> {
    return Promise.async {
      return try self.encode(image: image)
    }
  }

  func decode(thumbhash: ArrayBuffer) throws -> any HybridImageSpec {
    let data = thumbhash.toData(copyIfNeeded: false)
    let uiImage = thumbHashToImage(hash: data)
    return HybridImage(uiImage: uiImage)
  }

  func decodeAsync(thumbhash: ArrayBuffer) throws -> Promise<any HybridImageSpec> {
    let data = thumbhash.toData(copyIfNeeded: true)
    return Promise.async {
      let uiImage = thumbHashToImage(hash: data)
      return HybridImage(uiImage: uiImage)
    }
  }

  func toBase64String(thumbhash: ArrayBuffer) throws -> String {
    let data = thumbhash.toData(copyIfNeeded: false)
    return data.base64EncodedString()
  }

  func fromBase64String(thumbhashBase64: String) throws -> ArrayBuffer {
    guard let data = Data(base64Encoded: thumbhashBase64) else {
      throw RuntimeError.error(withMessage: "The given ThumbHash (\(thumbhashBase64)) is not a valid Base64 encoded Hash!")
    }
    return try ArrayBuffer.copy(data: data)
  }
}
