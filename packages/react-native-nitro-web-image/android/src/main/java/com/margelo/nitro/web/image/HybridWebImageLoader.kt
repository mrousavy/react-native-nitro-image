package com.margelo.nitro.web.image

import android.content.Context
import android.widget.ImageView
import coil3.ImageLoader
import coil3.load
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.HybridImageLoaderSpec
import com.margelo.nitro.image.HybridNitroImageViewSpec

class HybridWebImageLoader(private val imageLoader: ImageLoader,
                           private val url: String,
                           private val options: AsyncImageLoadOptions?,
                           private val context: Context) : HybridImageLoaderSpec() {
    override fun loadImage(): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val imageView = forView.view as? ImageView ?: return

        imageView.load(url, imageLoader) {
            this.applyOptions(options)
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        // Coil automatically handles recycling here - I _think_.
    }
}
