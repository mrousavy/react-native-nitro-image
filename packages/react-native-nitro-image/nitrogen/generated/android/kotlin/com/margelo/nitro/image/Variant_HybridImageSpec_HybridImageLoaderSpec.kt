///
/// Variant_HybridImageSpec_HybridImageLoaderSpec.kt
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

package com.margelo.nitro.image

import com.facebook.proguard.annotations.DoNotStrip


/**
 * Represents the TypeScript variant "HybridImageSpec|HybridImageLoaderSpec".
 */
@Suppress("ClassName")
@DoNotStrip
sealed class Variant_HybridImageSpec_HybridImageLoaderSpec {
  @DoNotStrip
  data class First(@DoNotStrip val value: HybridImageSpec): Variant_HybridImageSpec_HybridImageLoaderSpec()
  @DoNotStrip
  data class Second(@DoNotStrip val value: HybridImageLoaderSpec): Variant_HybridImageSpec_HybridImageLoaderSpec()

  inline fun <reified T> getAs(): T? = when (this) {
    is First -> value as? T
    is Second -> value as? T
  }

  val isFirst: Boolean
    get() = this is First
  val isSecond: Boolean
    get() = this is Second

  companion object {
    @JvmStatic
    @DoNotStrip
    fun create(value: HybridImageSpec): Variant_HybridImageSpec_HybridImageLoaderSpec = First(value)
    @JvmStatic
    @DoNotStrip
    fun create(value: HybridImageLoaderSpec): Variant_HybridImageSpec_HybridImageLoaderSpec = Second(value)
  }
}
