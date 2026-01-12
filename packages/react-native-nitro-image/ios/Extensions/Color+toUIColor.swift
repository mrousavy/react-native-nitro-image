//
//  Color+toUIColor.swift
//  react-native-nitro-image
//
//  Created by Marc Rousavy on 05.11.25.
//

import Foundation
import UIKit

extension Color {
  func toUIColor() -> UIColor {
    return UIColor(red: r,
                   green: g,
                   blue: b,
                   alpha: a ?? 1.0)
  }
}
