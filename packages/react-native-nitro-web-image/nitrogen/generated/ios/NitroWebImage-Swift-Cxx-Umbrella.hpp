///
/// NitroWebImage-Swift-Cxx-Umbrella.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

// Forward declarations of C++ defined types
// Forward declaration of `AsyncImageLoadOptions` to properly resolve imports.
namespace margelo::nitro::web::image { struct AsyncImageLoadOptions; }
// Forward declaration of `AsyncImagePriority` to properly resolve imports.
namespace margelo::nitro::web::image { enum class AsyncImagePriority; }
// Forward declaration of `HybridImageLoaderSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageLoaderSpec; }
// Forward declaration of `HybridImageSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageSpec; }
// Forward declaration of `HybridWebImageFactorySpec` to properly resolve imports.
namespace margelo::nitro::web::image { class HybridWebImageFactorySpec; }

// Include C++ defined types
#include "AsyncImageLoadOptions.hpp"
#include "AsyncImagePriority.hpp"
#include "HybridWebImageFactorySpec.hpp"
#include <NitroImage/HybridImageLoaderSpec.hpp>
#include <NitroImage/HybridImageSpec.hpp>
#include <NitroModules/Promise.hpp>
#include <NitroModules/Result.hpp>
#include <exception>
#include <memory>
#include <optional>
#include <string>

// C++ helpers for Swift
#include "NitroWebImage-Swift-Cxx-Bridge.hpp"

// Common C++ types used in Swift
#include <NitroModules/ArrayBufferHolder.hpp>
#include <NitroModules/AnyMapUtils.hpp>
#include <NitroModules/RuntimeError.hpp>
#include <NitroModules/DateToChronoDate.hpp>

// Forward declarations of Swift defined types
// Forward declaration of `HybridImageLoaderSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageLoaderSpec_cxx; }
// Forward declaration of `HybridImageSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageSpec_cxx; }
// Forward declaration of `HybridWebImageFactorySpec_cxx` to properly resolve imports.
namespace NitroWebImage { class HybridWebImageFactorySpec_cxx; }

// Include Swift defined types
#if __has_include("NitroWebImage-Swift.h")
// This header is generated by Xcode/Swift on every app build.
// If it cannot be found, make sure the Swift module's name (= podspec name) is actually "NitroWebImage".
#include "NitroWebImage-Swift.h"
// Same as above, but used when building with frameworks (`use_frameworks`)
#elif __has_include(<NitroWebImage/NitroWebImage-Swift.h>)
#include <NitroWebImage/NitroWebImage-Swift.h>
#else
#error NitroWebImage's autogenerated Swift header cannot be found! Make sure the Swift module's name (= podspec name) is actually "NitroWebImage", and try building the app first.
#endif
