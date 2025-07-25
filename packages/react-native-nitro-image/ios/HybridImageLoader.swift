//
//  HybridImageLoader.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import NitroModules

class HybridImageLoader: HybridImageLoaderSpec {
  typealias LoadFunc = () throws -> Promise<any HybridImageSpec>
  typealias RequestFunc = (_ for: any HybridNitroImageViewSpec) throws -> Void
  typealias DropFunc = (_ for: any HybridNitroImageViewSpec) throws -> Void
  
  private let load: LoadFunc
  private let requestImage: RequestFunc
  private let dropImage: DropFunc
  
  init(load: @escaping LoadFunc) {
    self.load = load
    self.requestImage = Self.defaultRequestFunc(forLoadFunc: load)
    self.dropImage = Self.defaultDropFunc()
  }
  init(load: @escaping LoadFunc,
       requestImage: @escaping RequestFunc,
       dropImage: @escaping DropFunc) {
    self.load = load
    self.requestImage = requestImage
    self.dropImage = dropImage
  }
  
  func loadImage() throws -> Promise<any HybridImageSpec> {
    return try load()
  }
  
  func requestImage(forView view: any HybridNitroImageViewSpec) throws {
    return try requestImage(view)
  }
  
  func dropImage(forView view: any HybridNitroImageViewSpec) throws {
    return try dropImage(view)
  }
}

fileprivate extension HybridImageLoader {
  static func defaultRequestFunc(forLoadFunc loadFunc: @escaping LoadFunc) -> RequestFunc {
    return { view in
      guard let view = view as? NativeImageView else { return }
      let promise = try loadFunc()
      promise.then { image in
        guard let image = image as? NativeImage else { return }
        view.imageView.image = image.uiImage
      }
      promise.catch { _ in view.imageView.image = nil }
    }
  }
  static func defaultDropFunc() -> DropFunc {
    return { view in
      guard let view = view as? NativeImageView else { return }
      view.imageView.image = nil
    }
  }
}
