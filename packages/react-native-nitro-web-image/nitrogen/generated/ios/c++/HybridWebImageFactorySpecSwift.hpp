///
/// HybridWebImageFactorySpecSwift.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include "HybridWebImageFactorySpec.hpp"

// Forward declaration of `HybridWebImageFactorySpec_cxx` to properly resolve imports.
namespace NitroWebImage { class HybridWebImageFactorySpec_cxx; }

// Forward declaration of `HybridImageLoaderSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageLoaderSpec; }
// Forward declaration of `AsyncImageLoadOptions` to properly resolve imports.
namespace margelo::nitro::web::image { struct AsyncImageLoadOptions; }
// Forward declaration of `AsyncImagePriority` to properly resolve imports.
namespace margelo::nitro::web::image { enum class AsyncImagePriority; }
// Forward declaration of `HybridImageSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageSpec; }

#include <memory>
#include <NitroImage/HybridImageLoaderSpec.hpp>
#include <string>
#include "AsyncImageLoadOptions.hpp"
#include <optional>
#include "AsyncImagePriority.hpp"
#include <NitroImage/HybridImageSpec.hpp>
#include <NitroModules/Promise.hpp>

#include "NitroWebImage-Swift-Cxx-Umbrella.hpp"

namespace margelo::nitro::web::image {

  /**
   * The C++ part of HybridWebImageFactorySpec_cxx.swift.
   *
   * HybridWebImageFactorySpecSwift (C++) accesses HybridWebImageFactorySpec_cxx (Swift), and might
   * contain some additional bridging code for C++ <> Swift interop.
   *
   * Since this obviously introduces an overhead, I hope at some point in
   * the future, HybridWebImageFactorySpec_cxx can directly inherit from the C++ class HybridWebImageFactorySpec
   * to simplify the whole structure and memory management.
   */
  class HybridWebImageFactorySpecSwift: public virtual HybridWebImageFactorySpec {
  public:
    // Constructor from a Swift instance
    explicit HybridWebImageFactorySpecSwift(const NitroWebImage::HybridWebImageFactorySpec_cxx& swiftPart):
      HybridObject(HybridWebImageFactorySpec::TAG),
      _swiftPart(swiftPart) { }

  public:
    // Get the Swift part
    inline NitroWebImage::HybridWebImageFactorySpec_cxx& getSwiftPart() noexcept {
      return _swiftPart;
    }

  public:
    inline size_t getExternalMemorySize() noexcept override {
      return _swiftPart.getMemorySize();
    }
    void dispose() noexcept override {
      _swiftPart.dispose();
    }

  public:
    // Properties
    

  public:
    // Methods
    inline std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec> createWebImageLoader(const std::string& url, const std::optional<AsyncImageLoadOptions>& options) override {
      auto __result = _swiftPart.createWebImageLoader(url, options);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>> loadFromURLAsync(const std::string& url, const std::optional<AsyncImageLoadOptions>& options) override {
      auto __result = _swiftPart.loadFromURLAsync(url, options);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline void preload(const std::string& url) override {
      auto __result = _swiftPart.preload(url);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }

  private:
    NitroWebImage::HybridWebImageFactorySpec_cxx _swiftPart;
  };

} // namespace margelo::nitro::web::image
