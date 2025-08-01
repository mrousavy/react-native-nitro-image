///
/// HybridWebImageFactorySpec.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import Foundation
import NitroModules
import NitroImage

/// See ``HybridWebImageFactorySpec``
public protocol HybridWebImageFactorySpec_protocol: HybridObject {
  // Properties
  

  // Methods
  func createWebImageLoader(url: String, options: AsyncImageLoadOptions?) throws -> (any HybridImageLoaderSpec)
  func loadFromURLAsync(url: String, options: AsyncImageLoadOptions?) throws -> Promise<(any HybridImageSpec)>
  func preload(url: String) throws -> Void
}

/// See ``HybridWebImageFactorySpec``
open class HybridWebImageFactorySpec_base {
  private weak var cxxWrapper: HybridWebImageFactorySpec_cxx? = nil
  public init() { }
  public func getCxxWrapper() -> HybridWebImageFactorySpec_cxx {
  #if DEBUG
    guard self is HybridWebImageFactorySpec else {
      fatalError("`self` is not a `HybridWebImageFactorySpec`! Did you accidentally inherit from `HybridWebImageFactorySpec_base` instead of `HybridWebImageFactorySpec`?")
    }
  #endif
    if let cxxWrapper = self.cxxWrapper {
      return cxxWrapper
    } else {
      let cxxWrapper = HybridWebImageFactorySpec_cxx(self as! HybridWebImageFactorySpec)
      self.cxxWrapper = cxxWrapper
      return cxxWrapper
    }
  }
}

/**
 * A Swift base-protocol representing the WebImageFactory HybridObject.
 * Implement this protocol to create Swift-based instances of WebImageFactory.
 * ```swift
 * class HybridWebImageFactory : HybridWebImageFactorySpec {
 *   // ...
 * }
 * ```
 */
public typealias HybridWebImageFactorySpec = HybridWebImageFactorySpec_protocol & HybridWebImageFactorySpec_base
