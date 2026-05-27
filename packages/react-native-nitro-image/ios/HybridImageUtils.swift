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
}
