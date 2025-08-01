///
/// HybridImageFactorySpec.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "HybridImageFactorySpec.hpp"

namespace margelo::nitro::image {

  void HybridImageFactorySpec::loadHybridMethods() {
    // load base methods/properties
    HybridObject::loadHybridMethods();
    // load custom methods/properties
    registerHybrids(this, [](Prototype& prototype) {
      prototype.registerHybridMethod("loadFromFile", &HybridImageFactorySpec::loadFromFile);
      prototype.registerHybridMethod("loadFromFileAsync", &HybridImageFactorySpec::loadFromFileAsync);
      prototype.registerHybridMethod("loadFromResources", &HybridImageFactorySpec::loadFromResources);
      prototype.registerHybridMethod("loadFromResourcesAsync", &HybridImageFactorySpec::loadFromResourcesAsync);
      prototype.registerHybridMethod("loadFromSymbol", &HybridImageFactorySpec::loadFromSymbol);
      prototype.registerHybridMethod("loadFromArrayBuffer", &HybridImageFactorySpec::loadFromArrayBuffer);
      prototype.registerHybridMethod("loadFromArrayBufferAsync", &HybridImageFactorySpec::loadFromArrayBufferAsync);
      prototype.registerHybridMethod("loadFromThumbHash", &HybridImageFactorySpec::loadFromThumbHash);
      prototype.registerHybridMethod("loadFromThumbHashAsync", &HybridImageFactorySpec::loadFromThumbHashAsync);
    });
  }

} // namespace margelo::nitro::image
