///
/// NitroImage-Swift-Cxx-Bridge.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

// Forward declarations of C++ defined types
// Forward declaration of `ArrayBufferHolder` to properly resolve imports.
namespace NitroModules { class ArrayBufferHolder; }
// Forward declaration of `ArrayBuffer` to properly resolve imports.
namespace NitroModules { class ArrayBuffer; }
// Forward declaration of `HybridImageFactorySpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageFactorySpec; }
// Forward declaration of `HybridImageLoaderFactorySpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageLoaderFactorySpec; }
// Forward declaration of `HybridImageLoaderSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageLoaderSpec; }
// Forward declaration of `HybridImageSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageSpec; }
// Forward declaration of `HybridImageUtilsSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridImageUtilsSpec; }
// Forward declaration of `HybridNitroImageViewSpec` to properly resolve imports.
namespace margelo::nitro::image { class HybridNitroImageViewSpec; }
// Forward declaration of `ResizeMode` to properly resolve imports.
namespace margelo::nitro::image { enum class ResizeMode; }

// Forward declarations of Swift defined types
// Forward declaration of `HybridImageFactorySpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageFactorySpec_cxx; }
// Forward declaration of `HybridImageLoaderFactorySpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageLoaderFactorySpec_cxx; }
// Forward declaration of `HybridImageLoaderSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageLoaderSpec_cxx; }
// Forward declaration of `HybridImageSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageSpec_cxx; }
// Forward declaration of `HybridImageUtilsSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridImageUtilsSpec_cxx; }
// Forward declaration of `HybridNitroImageViewSpec_cxx` to properly resolve imports.
namespace NitroImage { class HybridNitroImageViewSpec_cxx; }

// Include C++ defined types
#include "HybridImageFactorySpec.hpp"
#include "HybridImageLoaderFactorySpec.hpp"
#include "HybridImageLoaderSpec.hpp"
#include "HybridImageSpec.hpp"
#include "HybridImageUtilsSpec.hpp"
#include "HybridNitroImageViewSpec.hpp"
#include "ResizeMode.hpp"
#include <NitroModules/ArrayBuffer.hpp>
#include <NitroModules/ArrayBufferHolder.hpp>
#include <NitroModules/Promise.hpp>
#include <NitroModules/PromiseHolder.hpp>
#include <NitroModules/Result.hpp>
#include <exception>
#include <functional>
#include <memory>
#include <optional>
#include <string>
#include <variant>

/**
 * Contains specialized versions of C++ templated types so they can be accessed from Swift,
 * as well as helper functions to interact with those C++ types from Swift.
 */
namespace margelo::nitro::image::bridge::swift {

  // pragma MARK: std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>
  /**
   * Specialized version of `std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>`.
   */
  using std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer___ = std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>;
  inline std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>> create_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer___() {
    return Promise<std::shared_ptr<ArrayBuffer>>::create();
  }
  inline PromiseHolder<std::shared_ptr<ArrayBuffer>> wrap_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer___(std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>> promise) {
    return PromiseHolder<std::shared_ptr<ArrayBuffer>>(std::move(promise));
  }
  
  // pragma MARK: std::function<void(const std::shared_ptr<ArrayBuffer>& /* result */)>
  /**
   * Specialized version of `std::function<void(const std::shared_ptr<ArrayBuffer>&)>`.
   */
  using Func_void_std__shared_ptr_ArrayBuffer_ = std::function<void(const std::shared_ptr<ArrayBuffer>& /* result */)>;
  /**
   * Wrapper class for a `std::function<void(const std::shared_ptr<ArrayBuffer>& / * result * /)>`, this can be used from Swift.
   */
  class Func_void_std__shared_ptr_ArrayBuffer__Wrapper final {
  public:
    explicit Func_void_std__shared_ptr_ArrayBuffer__Wrapper(std::function<void(const std::shared_ptr<ArrayBuffer>& /* result */)>&& func): _function(std::make_unique<std::function<void(const std::shared_ptr<ArrayBuffer>& /* result */)>>(std::move(func))) {}
    inline void call(ArrayBufferHolder result) const {
      _function->operator()(result.getArrayBuffer());
    }
  private:
    std::unique_ptr<std::function<void(const std::shared_ptr<ArrayBuffer>& /* result */)>> _function;
  } SWIFT_NONCOPYABLE;
  Func_void_std__shared_ptr_ArrayBuffer_ create_Func_void_std__shared_ptr_ArrayBuffer_(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__shared_ptr_ArrayBuffer__Wrapper wrap_Func_void_std__shared_ptr_ArrayBuffer_(Func_void_std__shared_ptr_ArrayBuffer_ value) {
    return Func_void_std__shared_ptr_ArrayBuffer__Wrapper(std::move(value));
  }
  
  // pragma MARK: std::function<void(const std::exception_ptr& /* error */)>
  /**
   * Specialized version of `std::function<void(const std::exception_ptr&)>`.
   */
  using Func_void_std__exception_ptr = std::function<void(const std::exception_ptr& /* error */)>;
  /**
   * Wrapper class for a `std::function<void(const std::exception_ptr& / * error * /)>`, this can be used from Swift.
   */
  class Func_void_std__exception_ptr_Wrapper final {
  public:
    explicit Func_void_std__exception_ptr_Wrapper(std::function<void(const std::exception_ptr& /* error */)>&& func): _function(std::make_unique<std::function<void(const std::exception_ptr& /* error */)>>(std::move(func))) {}
    inline void call(std::exception_ptr error) const {
      _function->operator()(error);
    }
  private:
    std::unique_ptr<std::function<void(const std::exception_ptr& /* error */)>> _function;
  } SWIFT_NONCOPYABLE;
  Func_void_std__exception_ptr create_Func_void_std__exception_ptr(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__exception_ptr_Wrapper wrap_Func_void_std__exception_ptr(Func_void_std__exception_ptr value) {
    return Func_void_std__exception_ptr_Wrapper(std::move(value));
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridImageSpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridImageSpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridImageSpec_ = std::shared_ptr<margelo::nitro::image::HybridImageSpec>;
  std::shared_ptr<margelo::nitro::image::HybridImageSpec> create_std__shared_ptr_margelo__nitro__image__HybridImageSpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridImageSpec_(std__shared_ptr_margelo__nitro__image__HybridImageSpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridImageSpec>
  using std__weak_ptr_margelo__nitro__image__HybridImageSpec_ = std::weak_ptr<margelo::nitro::image::HybridImageSpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridImageSpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridImageSpec_(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& strong) { return strong; }
  
  // pragma MARK: std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>
  /**
   * Specialized version of `std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>`.
   */
  using std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec___ = std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>;
  inline std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>> create_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec___() {
    return Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>::create();
  }
  inline PromiseHolder<std::shared_ptr<margelo::nitro::image::HybridImageSpec>> wrap_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec___(std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>> promise) {
    return PromiseHolder<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>(std::move(promise));
  }
  
  // pragma MARK: std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& /* result */)>
  /**
   * Specialized version of `std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>&)>`.
   */
  using Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec_ = std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& /* result */)>;
  /**
   * Wrapper class for a `std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& / * result * /)>`, this can be used from Swift.
   */
  class Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec__Wrapper final {
  public:
    explicit Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec__Wrapper(std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& /* result */)>&& func): _function(std::make_unique<std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& /* result */)>>(std::move(func))) {}
    inline void call(std::shared_ptr<margelo::nitro::image::HybridImageSpec> result) const {
      _function->operator()(result);
    }
  private:
    std::unique_ptr<std::function<void(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& /* result */)>> _function;
  } SWIFT_NONCOPYABLE;
  Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec_ create_Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec_(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec__Wrapper wrap_Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec_(Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec_ value) {
    return Func_void_std__shared_ptr_margelo__nitro__image__HybridImageSpec__Wrapper(std::move(value));
  }
  
  // pragma MARK: std::shared_ptr<Promise<void>>
  /**
   * Specialized version of `std::shared_ptr<Promise<void>>`.
   */
  using std__shared_ptr_Promise_void__ = std::shared_ptr<Promise<void>>;
  inline std::shared_ptr<Promise<void>> create_std__shared_ptr_Promise_void__() {
    return Promise<void>::create();
  }
  inline PromiseHolder<void> wrap_std__shared_ptr_Promise_void__(std::shared_ptr<Promise<void>> promise) {
    return PromiseHolder<void>(std::move(promise));
  }
  
  // pragma MARK: std::function<void()>
  /**
   * Specialized version of `std::function<void()>`.
   */
  using Func_void = std::function<void()>;
  /**
   * Wrapper class for a `std::function<void()>`, this can be used from Swift.
   */
  class Func_void_Wrapper final {
  public:
    explicit Func_void_Wrapper(std::function<void()>&& func): _function(std::make_unique<std::function<void()>>(std::move(func))) {}
    inline void call() const {
      _function->operator()();
    }
  private:
    std::unique_ptr<std::function<void()>> _function;
  } SWIFT_NONCOPYABLE;
  Func_void create_Func_void(void* _Nonnull swiftClosureWrapper);
  inline Func_void_Wrapper wrap_Func_void(Func_void value) {
    return Func_void_Wrapper(std::move(value));
  }
  
  // pragma MARK: std::shared_ptr<Promise<std::string>>
  /**
   * Specialized version of `std::shared_ptr<Promise<std::string>>`.
   */
  using std__shared_ptr_Promise_std__string__ = std::shared_ptr<Promise<std::string>>;
  inline std::shared_ptr<Promise<std::string>> create_std__shared_ptr_Promise_std__string__() {
    return Promise<std::string>::create();
  }
  inline PromiseHolder<std::string> wrap_std__shared_ptr_Promise_std__string__(std::shared_ptr<Promise<std::string>> promise) {
    return PromiseHolder<std::string>(std::move(promise));
  }
  
  // pragma MARK: std::function<void(const std::string& /* result */)>
  /**
   * Specialized version of `std::function<void(const std::string&)>`.
   */
  using Func_void_std__string = std::function<void(const std::string& /* result */)>;
  /**
   * Wrapper class for a `std::function<void(const std::string& / * result * /)>`, this can be used from Swift.
   */
  class Func_void_std__string_Wrapper final {
  public:
    explicit Func_void_std__string_Wrapper(std::function<void(const std::string& /* result */)>&& func): _function(std::make_unique<std::function<void(const std::string& /* result */)>>(std::move(func))) {}
    inline void call(std::string result) const {
      _function->operator()(result);
    }
  private:
    std::unique_ptr<std::function<void(const std::string& /* result */)>> _function;
  } SWIFT_NONCOPYABLE;
  Func_void_std__string create_Func_void_std__string(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__string_Wrapper wrap_Func_void_std__string(Func_void_std__string value) {
    return Func_void_std__string_Wrapper(std::move(value));
  }
  
  // pragma MARK: Result<std::shared_ptr<ArrayBuffer>>
  using Result_std__shared_ptr_ArrayBuffer__ = Result<std::shared_ptr<ArrayBuffer>>;
  inline Result_std__shared_ptr_ArrayBuffer__ create_Result_std__shared_ptr_ArrayBuffer__(const std::shared_ptr<ArrayBuffer>& value) {
    return Result<std::shared_ptr<ArrayBuffer>>::withValue(value);
  }
  inline Result_std__shared_ptr_ArrayBuffer__ create_Result_std__shared_ptr_ArrayBuffer__(const std::exception_ptr& error) {
    return Result<std::shared_ptr<ArrayBuffer>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>>
  using Result_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer____ = Result<std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>>;
  inline Result_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer____ create_Result_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer____(const std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>& value) {
    return Result<std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer____ create_Result_std__shared_ptr_Promise_std__shared_ptr_ArrayBuffer____(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<std::shared_ptr<ArrayBuffer>>>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>
  using Result_std__shared_ptr_margelo__nitro__image__HybridImageSpec__ = Result<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>;
  inline Result_std__shared_ptr_margelo__nitro__image__HybridImageSpec__ create_Result_std__shared_ptr_margelo__nitro__image__HybridImageSpec__(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& value) {
    return Result<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>::withValue(value);
  }
  inline Result_std__shared_ptr_margelo__nitro__image__HybridImageSpec__ create_Result_std__shared_ptr_margelo__nitro__image__HybridImageSpec__(const std::exception_ptr& error) {
    return Result<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>>
  using Result_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec____ = Result<std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>>;
  inline Result_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec____ create_Result_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec____(const std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>& value) {
    return Result<std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec____ create_Result_std__shared_ptr_Promise_std__shared_ptr_margelo__nitro__image__HybridImageSpec____(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<std::shared_ptr<margelo::nitro::image::HybridImageSpec>>>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<void>>>
  using Result_std__shared_ptr_Promise_void___ = Result<std::shared_ptr<Promise<void>>>;
  inline Result_std__shared_ptr_Promise_void___ create_Result_std__shared_ptr_Promise_void___(const std::shared_ptr<Promise<void>>& value) {
    return Result<std::shared_ptr<Promise<void>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_void___ create_Result_std__shared_ptr_Promise_void___(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<void>>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<std::string>>>
  using Result_std__shared_ptr_Promise_std__string___ = Result<std::shared_ptr<Promise<std::string>>>;
  inline Result_std__shared_ptr_Promise_std__string___ create_Result_std__shared_ptr_Promise_std__string___(const std::shared_ptr<Promise<std::string>>& value) {
    return Result<std::shared_ptr<Promise<std::string>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_std__string___ create_Result_std__shared_ptr_Promise_std__string___(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<std::string>>>::withError(error);
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridImageFactorySpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridImageFactorySpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridImageFactorySpec_ = std::shared_ptr<margelo::nitro::image::HybridImageFactorySpec>;
  std::shared_ptr<margelo::nitro::image::HybridImageFactorySpec> create_std__shared_ptr_margelo__nitro__image__HybridImageFactorySpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridImageFactorySpec_(std__shared_ptr_margelo__nitro__image__HybridImageFactorySpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridImageFactorySpec>
  using std__weak_ptr_margelo__nitro__image__HybridImageFactorySpec_ = std::weak_ptr<margelo::nitro::image::HybridImageFactorySpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridImageFactorySpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridImageFactorySpec_(const std::shared_ptr<margelo::nitro::image::HybridImageFactorySpec>& strong) { return strong; }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridNitroImageViewSpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridNitroImageViewSpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridNitroImageViewSpec_ = std::shared_ptr<margelo::nitro::image::HybridNitroImageViewSpec>;
  std::shared_ptr<margelo::nitro::image::HybridNitroImageViewSpec> create_std__shared_ptr_margelo__nitro__image__HybridNitroImageViewSpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridNitroImageViewSpec_(std__shared_ptr_margelo__nitro__image__HybridNitroImageViewSpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridNitroImageViewSpec>
  using std__weak_ptr_margelo__nitro__image__HybridNitroImageViewSpec_ = std::weak_ptr<margelo::nitro::image::HybridNitroImageViewSpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridNitroImageViewSpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridNitroImageViewSpec_(const std::shared_ptr<margelo::nitro::image::HybridNitroImageViewSpec>& strong) { return strong; }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec_ = std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>;
  std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec> create_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec_(std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridImageLoaderSpec>
  using std__weak_ptr_margelo__nitro__image__HybridImageLoaderSpec_ = std::weak_ptr<margelo::nitro::image::HybridImageLoaderSpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridImageLoaderSpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec_(const std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>& strong) { return strong; }
  
  // pragma MARK: Result<void>
  using Result_void_ = Result<void>;
  inline Result_void_ create_Result_void_() {
    return Result<void>::withValue();
  }
  inline Result_void_ create_Result_void_(const std::exception_ptr& error) {
    return Result<void>::withError(error);
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_ = std::shared_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>;
  std::shared_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec> create_std__shared_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_(std__shared_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>
  using std__weak_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_ = std::weak_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridImageLoaderFactorySpec_(const std::shared_ptr<margelo::nitro::image::HybridImageLoaderFactorySpec>& strong) { return strong; }
  
  // pragma MARK: Result<std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>
  using Result_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ = Result<std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>;
  inline Result_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ create_Result_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(const std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>& value) {
    return Result<std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>::withValue(value);
  }
  inline Result_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ create_Result_std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(const std::exception_ptr& error) {
    return Result<std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>::withError(error);
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::image::HybridImageUtilsSpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::image::HybridImageUtilsSpec>`.
   */
  using std__shared_ptr_margelo__nitro__image__HybridImageUtilsSpec_ = std::shared_ptr<margelo::nitro::image::HybridImageUtilsSpec>;
  std::shared_ptr<margelo::nitro::image::HybridImageUtilsSpec> create_std__shared_ptr_margelo__nitro__image__HybridImageUtilsSpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__image__HybridImageUtilsSpec_(std__shared_ptr_margelo__nitro__image__HybridImageUtilsSpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::image::HybridImageUtilsSpec>
  using std__weak_ptr_margelo__nitro__image__HybridImageUtilsSpec_ = std::weak_ptr<margelo::nitro::image::HybridImageUtilsSpec>;
  inline std__weak_ptr_margelo__nitro__image__HybridImageUtilsSpec_ weakify_std__shared_ptr_margelo__nitro__image__HybridImageUtilsSpec_(const std::shared_ptr<margelo::nitro::image::HybridImageUtilsSpec>& strong) { return strong; }
  
  // pragma MARK: Result<std::string>
  using Result_std__string_ = Result<std::string>;
  inline Result_std__string_ create_Result_std__string_(const std::string& value) {
    return Result<std::string>::withValue(value);
  }
  inline Result_std__string_ create_Result_std__string_(const std::exception_ptr& error) {
    return Result<std::string>::withError(error);
  }
  
  // pragma MARK: std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>
  /**
   * Wrapper struct for `std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>`.
   * std::variant cannot be used in Swift because of a Swift bug.
   * Not even specializing it works. So we create a wrapper struct.
   */
  struct std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ {
    std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>> variant;
    std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>> variant): variant(variant) { }
    operator std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>() const {
      return variant;
    }
    inline size_t index() const {
      return variant.index();
    }
    inline std::shared_ptr<margelo::nitro::image::HybridImageSpec> get_0() const {
      return std::get<0>(variant);
    }
    inline std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec> get_1() const {
      return std::get<1>(variant);
    }
  };
  inline std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ create_std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(const std::shared_ptr<margelo::nitro::image::HybridImageSpec>& value) {
    return std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(value);
  }
  inline std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__ create_std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(const std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>& value) {
    return std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec__(value);
  }
  
  // pragma MARK: std::optional<std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>>
  /**
   * Specialized version of `std::optional<std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>>`.
   */
  using std__optional_std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec___ = std::optional<std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>>;
  inline std::optional<std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>> create_std__optional_std__variant_std__shared_ptr_margelo__nitro__image__HybridImageSpec___std__shared_ptr_margelo__nitro__image__HybridImageLoaderSpec___(const std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>& value) {
    return std::optional<std::variant<std::shared_ptr<margelo::nitro::image::HybridImageSpec>, std::shared_ptr<margelo::nitro::image::HybridImageLoaderSpec>>>(value);
  }
  
  // pragma MARK: std::optional<ResizeMode>
  /**
   * Specialized version of `std::optional<ResizeMode>`.
   */
  using std__optional_ResizeMode_ = std::optional<ResizeMode>;
  inline std::optional<ResizeMode> create_std__optional_ResizeMode_(const ResizeMode& value) {
    return std::optional<ResizeMode>(value);
  }

} // namespace margelo::nitro::image::bridge::swift
