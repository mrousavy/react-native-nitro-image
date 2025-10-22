//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules
import UniformTypeIdentifiers

class HybridImageUtils: HybridImageUtilsSpec {
  var supportsHeicLoading: Bool {
    // Check if the type is supported by the OS
    let types = CGImageDestinationCopyTypeIdentifiers() as! [String]
    return types.contains(UTType.heic.identifier)
  }
  var supportsHeicWriting: Bool {
    // HEIC .heicData() is only available on iOS 17
    if #available(iOS 17.0, *) {
      return true
    } else {
      return false
    }
  }
  
  func thumbHashToBase64String(thumbhash: ArrayBuffer) throws -> String {
    let data = thumbhash.toData(copyIfNeeded: false)
    return data.base64EncodedString()
  }

  func thumbhashFromBase64String(thumbhashBase64: String) throws -> ArrayBuffer {
    guard let data = Data(base64Encoded: thumbhashBase64) else {
      throw RuntimeError.error(withMessage: "The given ThumbHash (\(thumbhashBase64)) is not a valid Base64 encoded Hash!")
    }
    return try ArrayBuffer.copy(data: data)
  }
}
