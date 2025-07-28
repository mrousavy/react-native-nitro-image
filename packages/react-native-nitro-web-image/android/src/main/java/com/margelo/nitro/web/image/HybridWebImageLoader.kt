package com.margelo.nitro.web.image

import android.content.Context
import android.widget.ImageView
import coil3.ImageLoader
import coil3.toBitmap
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.HybridNitroImageViewSpec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class HybridWebImageLoader(private val imageLoader: ImageLoader,
                           private val url: String,
                           private val options: AsyncImageLoadOptions?,
                           private val context: Context) : HybridWebImageLoaderSpec() {
    private val defaultScope = CoroutineScope(Dispatchers.Default)

    override fun loadImage(): Promise<HybridImageSpec> {
        return imageLoader.loadImageAsync(url, options, context)
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val imageView = forView.view as? ImageView ?: return

        defaultScope.launch {
            val image = imageLoader.loadCoilImageAsync(url, options, context)
            // TODO: Avoid .toBitmap() and use Coil's default way of setting images
            imageView.setImageBitmap(image.toBitmap())
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        // TODO: Do we need to remove the Image from the View here?
    }
}