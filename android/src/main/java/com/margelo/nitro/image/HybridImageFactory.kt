package com.margelo.nitro.image

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
import java.nio.ByteOrder

class HybridImageFactory: HybridImageFactorySpec() {
    private val context: ReactApplicationContext
        get() = NitroModules.applicationContext ?: throw Error("No context - NitroModules.applicationContext was null!")
    private val imageLoader = ImageLoader(context)

    override fun loadFromURLAsync(url: String): Promise<HybridImageSpec> {
        return Promise.async {
            // 1. Create the Coil Request
            val request = ImageRequest.Builder(context)
                .data(url)
                .build()
            // 2. Execute it (async)
            val result = imageLoader.execute(request)
            val image = result.image ?: throw Error("Failed to load Image!")
            // 3. Downcast to a Bitmap - if that fails, it might be an Animated Image...
            val bitmap = image as? BitmapImage ?: throw Error("Requested Image is not a Bitmap!")
            return@async HybridImage(bitmap.bitmap)
        }
    }

    @SuppressLint("DiscouragedApi")
    override fun loadFromResources(name: String): HybridImageSpec {
        val context = NitroModules.applicationContext ?: throw Error("No context!")
        // Look up ID via it's name
        val rawResourceId: Int = context.resources
            .getIdentifier(name, "raw", context.packageName)
        if (rawResourceId == 0) {
            // It's bundled into the Android resources/assets
            val stream = context.assets.open(name)
            val bitmap = BitmapFactory.decodeStream(stream)
            return HybridImage(bitmap)
        } else {
            // For assets bundled with 'require' instead of linked, they are bundled into `res/raw` in release mode
            val stream = context.resources.openRawResource(rawResourceId)
            val bitmap = BitmapFactory.decodeStream(stream)
            return HybridImage(bitmap)
        }
    }
    override fun loadFromResourcesAsync(name: String): Promise<HybridImageSpec> {
        return Promise.async { loadFromResources(name) }
    }

    override fun loadFromSymbol(symbolName: String): HybridImageSpec {
        throw Error("ImageFactory.loadFromSymbol(symbolName:) is not supported on Android!")
    }

    override fun loadFromArrayBuffer(buffer: ArrayBuffer): HybridImageSpec {
        val array = buffer.toByteArray()
        val bitmap = BitmapFactory.decodeByteArray(array, 0, buffer.size)
        return HybridImage(bitmap)
    }

    override fun loadFromArrayBufferAsync(buffer: ArrayBuffer): Promise<HybridImageSpec> {
        return Promise.async { loadFromArrayBuffer(buffer) }
    }

    override fun loadFromFile(filePath: String): HybridImageSpec {
        val bitmap = BitmapFactory.decodeFile(filePath)
        return HybridImage(bitmap)
    }

    override fun loadFromFileAsync(filePath: String): Promise<HybridImageSpec> {
        return Promise.async { loadFromFile(filePath) }
    }

    private fun loadFromThumbHash(thumbHashBytes: ByteArray): HybridImage {
        val rgba = ThumbHash.thumbHashToRGBA(thumbHashBytes)

        val bitmap = Bitmap.createBitmap(rgba.width, rgba.height, Bitmap.Config.ARGB_8888)

        // TODO: Use ByteBuffer.wrap() instead of this copy here
        val buffer = ByteBuffer
            .allocateDirect(rgba.rgba.size)
            .order(ByteOrder.nativeOrder())
            .put(rgba.rgba)
        buffer.rewind()
        bitmap.copyPixelsFromBuffer(buffer)
        return HybridImage(bitmap)
    }

    override fun loadFromThumbHash(thumbhash: ArrayBuffer): HybridImageSpec {
        // copyIfNeeded can be false since we are running this synchronously
        val bytes = thumbhash.toByteArray()
        return loadFromThumbHash(bytes)
    }

    override fun loadFromThumbHashAsync(thumbhash: ArrayBuffer): Promise<HybridImageSpec> {
        // copyIfNeeded needs to be true since we switch threads
        val bytes = thumbhash.toByteArray()
        return Promise.async { loadFromThumbHash(bytes) }
    }
}
