//
//  String+normalizedFilePath.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 19.05.26.
//

import Foundation

extension String {
  var normalizedFilePath: String {
    guard hasPrefix("file://") else {
      return self
    }

    if let url = URL(string: self),
       url.isFileURL,
       !url.path.isEmpty {
      return url.path
    }

    return String(dropFirst("file://".count))
  }
}
