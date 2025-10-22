//
//  HybridImageLoaderFactory.swift
//  Pods
//
//  Created by Marc Rousavy on 25.07.25.
//

import NitroModules

class HybridImageLoaderFactory: HybridImageLoaderFactorySpec {
  private let imageFactory = HybridImageFactory()

  func createFileImageLoader(filePath: String) throws -> any HybridImageLoaderSpec {
    return HybridImageLoader(load: {
      try self.imageFactory.loadFromFileAsync(filePath: filePath)
    })
  }

  func createResourceImageLoader(name: String) throws -> any HybridImageLoaderSpec {
    return HybridImageLoader(load: {
      try self.imageFactory.loadFromResourcesAsync(name: name)
    })
  }

  func createSymbolImageLoader(symbolName: String) throws -> any HybridImageLoaderSpec {
    return HybridImageLoader(load: {
      let image = try self.imageFactory.loadFromSymbol(symbolName: symbolName)
      return Promise.resolved(withResult: image)
    })
  }
  
  func createRawPixelDataImageLoader(data: RawPixelData) throws -> any HybridImageLoaderSpec {
    return HybridImageLoader(load: {
      try self.imageFactory.loadFromRawPixelDataAsync(data: data, allowGpu: false)
    })
  }
  
  func createEncodedImageDataImageLoader(data: EncodedImageData) throws -> any HybridImageLoaderSpec {
    return HybridImageLoader(load: {
      try self.imageFactory.loadFromEncodedImageDataAsync(data: data)
    })
  }
}
