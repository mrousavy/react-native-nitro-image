package com.margelo.nitro.web.image

import android.content.Context
import android.widget.ImageView
import coil3.ImageLoader
import coil3.load
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridNitroImageViewSpec
import com.margelo.nitro.web.image.cache.CACHE_PRIORITY_EXTRA
import com.margelo.nitro.web.image.extensions.applyOptions
import com.margelo.nitro.web.image.extensions.loadImageAsync

class HybridWebImageLoader(private val imageLoader: ImageLoader,
                           private val url: String,
                           private val options: AsyncImageLoadOptions?,
                           private val context: Context) : HybridImageLoaderSpec() {
    override fun loadImage(): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val imageView = forView.view as? ImageView ?: return
        val cachePriority = forView.cachePriority?.toInt() ?: 1

        imageView.load(url, imageLoader) {
            this.applyOptions(options)
            memoryCacheKeyExtra(CACHE_PRIORITY_EXTRA, cachePriority.toString())
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        // Coil automatically handles recycling here - I _think_.
    }
}
