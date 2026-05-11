package com.margelo.nitro.web.image

import android.content.Context
import android.util.Log
import android.widget.ImageView
import coil3.ImageLoader
import coil3.load
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridNitroImageViewSpec
import com.margelo.nitro.web.image.extensions.applyOptions
import com.margelo.nitro.web.image.extensions.loadImageAsync
import com.margelo.nitro.web.image.interceptors.PriorityKey

class HybridWebImageLoader(private val imageLoader: ImageLoader,
                           private val url: String,
                           private val options: AsyncImageLoadOptions?,
                           private val context: Context) : HybridImageLoaderSpec() {
    override fun loadImage(): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val imageView = forView.view as? ImageView ?: return

        Log.d("WebImage", "requestImage start: $url (priority=${forView.priority})")
        imageView.load(url, imageLoader) {
            this.applyOptions(options)
            forView.priority?.toInt()?.let { extras[PriorityKey] = it }
            listener(
                onStart = { Log.d("WebImage", "start:  $url") },
                onSuccess = { _, _ -> Log.d("WebImage", "loaded: $url") },
                onError = { _, err -> Log.w("WebImage", "error:  $url", err.throwable) },
                onCancel = { Log.d("WebImage", "cancel: $url") },
            )
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        // Coil automatically handles recycling here - I _think_.
    }
}
