package com.margelo.nitro.web.image

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import coil3.BitmapImage
import coil3.ImageLoader
import coil3.request.ImageRequest
import com.facebook.react.bridge.ReactApplicationContext
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import java.nio.ByteBuffer

class HybridWebImageFactory: HybridWebImageFactorySpec() {
    private val context: ReactApplicationContext
        get() = NitroModules.applicationContext ?: throw Error("No context - NitroModules.applicationContext was null!")
    private val imageLoader = ImageLoader(context)

    override fun loadFromURLAsync(url: String, options: AsyncImageLoadOptions?): Promise<HybridImageSpec> {
        return Promise.async {
            // 1. Create the Coil Request
            val request = ImageRequest.Builder(context)
                .data(url)
                .applyOptions(options)
                .build()
            // 2. Execute it (async)
            val result = imageLoader.execute(request)
            val image = result.image ?: throw Error("Failed to load Image!")
            // 3. Downcast to a Bitmap - if that fails, it might be an Animated Image...
            val bitmap = image as? BitmapImage ?: throw Error("Requested Image is not a Bitmap!")
            return@async HybridImage(bitmap.bitmap)
        }
    }
}
