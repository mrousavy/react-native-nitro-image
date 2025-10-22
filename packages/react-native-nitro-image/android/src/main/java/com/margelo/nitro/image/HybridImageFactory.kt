package com.margelo.nitro.image

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import java.nio.ByteBuffer

@DoNotStrip
@Keep
class HybridImageFactory: HybridImageFactorySpec() {
    @SuppressLint("DiscouragedApi")
    override fun loadFromResources(name: String): HybridImageSpec {
        val context = NitroModules.applicationContext ?: throw Error("No context!")
        // Look up ID via it's name
        val rawResourceId: Int = context.resources
            .getIdentifier(name, "drawable", context.packageName)
        if (rawResourceId == 0) {
            // It's bundled into the Android resources/assets
            context.assets.open(name).use { stream ->
                val bitmap = BitmapFactory.decodeStream(stream)
                return HybridImage(bitmap)
            }
        } else {
            // For assets bundled with 'require' instead of linked, they are bundled into `res/raw` in release mode
            context.resources.openRawResource(rawResourceId).use { stream ->
                val bitmap = BitmapFactory.decodeStream(stream)
                return HybridImage(bitmap)
            }
        }
    }
    override fun loadFromResourcesAsync(name: String): Promise<HybridImageSpec> {
        return Promise.async { loadFromResources(name) }
    }

    override fun loadFromSymbol(symbolName: String): HybridImageSpec {
        throw Error("ImageFactory.loadFromSymbol(symbolName:) is not supported on Android!")
    }

    override fun loadFromRawPixelData(data: RawPixelData): HybridImageSpec {
        val bitmap = bitmapFromRawPixelData(data)
        return HybridImage(bitmap)
    }
    override fun loadFromRawPixelDataAsync(data: RawPixelData): Promise<HybridImageSpec> {
        val bufferCopy = data.buffer.copyIfNotOwner()
        val dataCopy = RawPixelData(bufferCopy, data.width, data.height, data.pixelFormat)
        return Promise.async { loadFromRawPixelData(dataCopy) }
    }

    private fun loadFromEncodedBytes(bytes: ByteArray): HybridImageSpec {
        val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
        return HybridImage(bitmap)
    }
    override fun loadFromEncodedImageData(data: EncodedImageData): HybridImageSpec {
        val bytes = data.buffer.toByteArray()
        return loadFromEncodedBytes(bytes)
    }
    override fun loadFromEncodedImageDataAsync(data: EncodedImageData): Promise<HybridImageSpec> {
        val bytes = data.buffer.toByteArray()
        return Promise.async { loadFromEncodedBytes(bytes) }
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
        val buffer = ByteBuffer.wrap(rgba.rgba)
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
