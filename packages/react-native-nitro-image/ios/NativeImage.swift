//
//  NativeImage.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import UIKit

/**
 * A protocol that represents a native image.
 * This can be used to downcast from `HybridImageSpec`
 * which gives you a concrete `UIImage`.
 *
 * If you want to use other Images with Image Loaders or Image Views,
 * make sure your native image class conforms to this protocol.
 */
public protocol NativeImage {
  var uiImage: UIImage { get }
}
