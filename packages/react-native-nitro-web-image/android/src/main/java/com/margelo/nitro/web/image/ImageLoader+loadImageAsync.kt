package com.margelo.nitro.web.image

import android.content.Context
import coil3.BitmapImage
import coil3.Image
import coil3.ImageLoader
import coil3.request.ImageRequest
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImage
import com.margelo.nitro.image.HybridImageSpec

suspend fun ImageLoader.loadCoilImageAsync(url: String,
                                           options: AsyncImageLoadOptions?,
                                           context: Context): Image {
    // 1. Create the Coil Request
    val request = ImageRequest.Builder(context)
        .data(url)
        .applyOptions(options)
        .build()
    // 2. Execute it (async)
    val result = this.execute(request)
    val image = result.image ?: throw Error("Failed to load Image!")
    return image
}

fun ImageLoader.loadImageAsync(url: String,
                               options: AsyncImageLoadOptions?,
                               context: Context
): Promise<HybridImageSpec> {
    return Promise.async {
        // 1. Load the coil image
        val image = loadCoilImageAsync(url, options, context)
        // 3. Downcast to a Bitmap - if that fails, it might be an Animated Image...
        val bitmap = image as? BitmapImage ?: throw Error("Requested Image is not a Bitmap!")
        return@async HybridImage(bitmap.bitmap)
    }
}
