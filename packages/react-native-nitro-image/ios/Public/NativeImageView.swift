//
//  NativeImageView.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import UIKit

/**
 * A protocol that represents a native image view.
 * This can be used to downcast from `HybridImageViewSpec`
 * which gives you a concrete `UIImageView`.
 * 
 * If you want to use other Image Views with Image Loaders,
 * make sure your native view class conforms to this protocol.
 */
public protocol NativeImageView {
  var imageView: UIImageView { get }
}
