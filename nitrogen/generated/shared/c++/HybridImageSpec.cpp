///
/// HybridImageSpec.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "HybridImageSpec.hpp"

namespace margelo::nitro::image {

  void HybridImageSpec::loadHybridMethods() {
    // load base methods/properties
    HybridObject::loadHybridMethods();
    // load custom methods/properties
    registerHybrids(this, [](Prototype& prototype) {
      prototype.registerHybridGetter("width", &HybridImageSpec::getWidth);
      prototype.registerHybridGetter("height", &HybridImageSpec::getHeight);
      prototype.registerHybridMethod("toArrayBuffer", &HybridImageSpec::toArrayBuffer);
      prototype.registerHybridMethod("toArrayBufferAsync", &HybridImageSpec::toArrayBufferAsync);
      prototype.registerHybridMethod("resize", &HybridImageSpec::resize);
      prototype.registerHybridMethod("resizeAsync", &HybridImageSpec::resizeAsync);
      prototype.registerHybridMethod("crop", &HybridImageSpec::crop);
      prototype.registerHybridMethod("cropAsync", &HybridImageSpec::cropAsync);
      prototype.registerHybridMethod("saveToFileAsync", &HybridImageSpec::saveToFileAsync);
      prototype.registerHybridMethod("saveToTemporaryFileAsync", &HybridImageSpec::saveToTemporaryFileAsync);
      prototype.registerHybridMethod("toThumbHash", &HybridImageSpec::toThumbHash);
      prototype.registerHybridMethod("toThumbHashAsync", &HybridImageSpec::toThumbHashAsync);
    });
  }

} // namespace margelo::nitro::image
