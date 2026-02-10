//
//  DispatchQueue+runOnMain.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 10.02.26.
//

import Foundation

extension DispatchQueue {
  static func runOnMain(_ block: @escaping () -> Void) {
    if Thread.isMainThread {
      block()
    } else {
      DispatchQueue.main.async(execute: block)
    }
  }
}
