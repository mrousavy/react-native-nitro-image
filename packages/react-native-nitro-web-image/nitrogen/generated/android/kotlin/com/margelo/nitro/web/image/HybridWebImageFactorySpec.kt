///
/// HybridWebImageFactorySpec.kt
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

package com.margelo.nitro.web.image

import androidx.annotation.Keep
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.*
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridImageSpec

/**
 * A Kotlin class representing the WebImageFactory HybridObject.
 * Implement this abstract class to create Kotlin-based instances of WebImageFactory.
 */
@DoNotStrip
@Keep
@Suppress(
  "KotlinJniMissingFunction", "unused",
  "RedundantSuppression", "RedundantUnitReturnType", "SimpleRedundantLet",
  "LocalVariableName", "PropertyName", "PrivatePropertyName", "FunctionName"
)
abstract class HybridWebImageFactorySpec: HybridObject() {
  @DoNotStrip
  private var mHybridData: HybridData = initHybrid()

  init {
    super.updateNative(mHybridData)
  }

  override fun updateNative(hybridData: HybridData) {
    mHybridData = hybridData
    super.updateNative(hybridData)
  }

  // Properties
  

  // Methods
  @DoNotStrip
  @Keep
  abstract fun createWebImageLoader(url: String, options: AsyncImageLoadOptions?): com.margelo.nitro.image.HybridImageLoaderSpec
  
  @DoNotStrip
  @Keep
  abstract fun loadFromURLAsync(url: String, options: AsyncImageLoadOptions?): Promise<com.margelo.nitro.image.HybridImageSpec>
  
  @DoNotStrip
  @Keep
  abstract fun preload(url: String): Unit

  private external fun initHybrid(): HybridData

  companion object {
    private const val TAG = "HybridWebImageFactorySpec"
  }
}
