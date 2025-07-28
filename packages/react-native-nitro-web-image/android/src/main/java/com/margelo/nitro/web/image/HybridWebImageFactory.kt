package com.margelo.nitro.web.image

import androidx.annotation.Keep
import coil3.ImageLoader
import com.facebook.common.internal.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridImageSpec

@DoNotStrip
@Keep
class HybridWebImageFactory: HybridWebImageFactorySpec() {
    private val context: ReactApplicationContext
        get() = NitroModules.applicationContext ?: throw Error("No context - NitroModules.applicationContext was null!")
    private val imageLoader = ImageLoader(context)

    override fun createWebImageLoader(
        url: String,
        options: AsyncImageLoadOptions?
    ): HybridImageLoaderSpec {
        return HybridWebImageLoader(imageLoader, url, options, context)
    }

    override fun loadImageAsync(
        url: String,
        options: AsyncImageLoadOptions?
    ): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }
}
