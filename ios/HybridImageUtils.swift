//
//  HybridImageFactory.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.06.25.
//

import Foundation
import NitroModules

class HybridImageUtils: HybridImageUtilsSpec {
  func thumbhashToString(thumbhash: ArrayBufferHolder) throws -> String {
    let data = thumbhash.toData(copyIfNeeded: false)
    return data.base64EncodedString()
  }
  
  func thumbhashFromBase64String(thumbhashBase64: String) throws -> ArrayBufferHolder {
    guard let data = Data(base64Encoded: thumbhashBase64) else {
      throw RuntimeError.error(withMessage: "The given ThumbHash (\(thumbhashBase64)) is not a valid Base64 encoded Hash!")
    }
    return try ArrayBufferHolder.copy(data: data)
  }
}
