package com.margelo.nitro.web.image

import androidx.annotation.Keep
import coil3.ImageLoader
import coil3.request.ImageRequest
import com.facebook.common.internal.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.web.image.extensions.loadImageAsync
import com.margelo.nitro.web.image.interceptors.PriorityGate
import com.margelo.nitro.web.image.interceptors.PriorityInterceptor

@DoNotStrip
@Keep
class HybridWebImageFactory: HybridWebImageFactorySpec() {
    private val context: ReactApplicationContext
        get() = NitroModules.applicationContext ?: throw Error("No context - NitroModules.applicationContext was null!")
    private val numOfCoresAvailable = Runtime.getRuntime().availableProcessors()
    private val maxConcurrentOperations = minOf(6, numOfCoresAvailable)
    private val priorityGate = PriorityGate(maxConcurrentOperations = maxConcurrentOperations)
    private val imageLoader = ImageLoader.Builder(context)
        .components { add(PriorityInterceptor(priorityGate)) }
        .build()

    override fun createWebImageLoader(
        url: String,
        options: AsyncImageLoadOptions?
    ): HybridImageLoaderSpec {
        return HybridWebImageLoader(imageLoader, url, options, context)
    }

    override fun loadFromURLAsync(
        url: String,
        options: AsyncImageLoadOptions?
    ): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }

    override fun preload(url: String) {
        // 1. Create the Coil Request
        val request = ImageRequest.Builder(context)
            .data(url)
            .build()
        // 2. Enqueue the request to prefetch it
        imageLoader.enqueue(request)
    }
}
