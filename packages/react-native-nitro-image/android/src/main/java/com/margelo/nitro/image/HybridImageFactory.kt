package com.margelo.nitro.image

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.util.Size
import androidx.annotation.Keep
import androidx.core.graphics.createBitmap
import com.facebook.common.internal.DoNotStrip
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.extensions.bitmapFromRawPixelData
import com.margelo.nitro.image.extensions.decodeSampledBitmap
import com.margelo.nitro.image.extensions.toBitmapColor
import com.margelo.nitro.image.extensions.toFilePath
import java.nio.ByteBuffer

@DoNotStrip
@Keep
class HybridImageFactory: HybridImageFactorySpec() {
    override fun createBlankImage(width: Double, height: Double, enableAlpha: Boolean, fill: Color?): HybridImageSpec {
        // 1. Create Bitmap config (either ARGB or RGB without alpha)
        val config = if (enableAlpha) Bitmap.Config.ARGB_8888 else Bitmap.Config.RGB_565
        // 2. Create the new Bitmap
        val bitmap = createBitmap(width.toInt(), height.toInt(), config)
        if (fill != null) {
            // 3. If we have a background fill, draw it!
            val color = fill.toBitmapColor()
            Canvas(bitmap).drawColor(color)
        }
        // 4. Wrap it in a HybridImage and return it
        return HybridImage(bitmap)
    }
    override fun createBlankImageAsync(width: Double, height: Double, enableAlpha: Boolean, fill: Color?): Promise<HybridImageSpec> {
        return Promise.async { createBlankImage(width, height, enableAlpha, fill) }
    }

    override fun loadFromResources(name: String): HybridImageSpec {
        return loadFromResources(name, null)
    }
    @SuppressLint("DiscouragedApi")
    fun loadFromResources(name: String, targetSize: Size?): HybridImageSpec {
        val context = NitroModules.applicationContext ?: throw Error("No context!")
        // Look up ID via it's name
        val rawResourceId: Int = context.resources
            .getIdentifier(name, "drawable", context.packageName)
        val bitmap = decodeSampledBitmap(targetSize) { options ->
            val stream = if (rawResourceId == 0) {
                // It's bundled into the Android resources/assets
                context.assets.open(name)
            } else {
                // For assets bundled with 'require' instead of linked, they are bundled into `res/raw` in release mode
                context.resources.openRawResource(rawResourceId)
            }
            stream.use { BitmapFactory.decodeStream(it, null, options) }
        }
        if (bitmap == null) {
            throw Error("Failed to load Image from resources! (Name: $name)")
        }
        return HybridImage(bitmap)
    }
    override fun loadFromResourcesAsync(name: String): Promise<HybridImageSpec> {
        return loadFromResourcesAsync(name, null)
    }
    fun loadFromResourcesAsync(name: String, targetSize: Size?): Promise<HybridImageSpec> {
        return Promise.async { loadFromResources(name, targetSize) }
    }

    override fun loadFromSymbol(symbolName: String): HybridImageSpec {
        throw Error("ImageFactory.loadFromSymbol(symbolName:) is not supported on Android!")
    }

    override fun loadFromRawPixelData(data: RawPixelData, allowGpu: Boolean?): HybridImageSpec {
        val allowGpu = allowGpu ?: false
        val bitmap = bitmapFromRawPixelData(data, allowGpu)
        return HybridImage(bitmap)
    }
    override fun loadFromRawPixelDataAsync(data: RawPixelData, allowGpu: Boolean?): Promise<HybridImageSpec> {
        val bufferCopy = data.buffer.asOwning()
        val dataCopy = RawPixelData(bufferCopy, data.width, data.height, data.pixelFormat)
        return Promise.async { loadFromRawPixelData(dataCopy, allowGpu) }
    }

    private fun loadFromEncodedBytes(bytes: ByteArray, targetSize: Size? = null): HybridImageSpec {
        val bitmap = decodeSampledBitmap(targetSize) { options ->
            BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)
        }
        if (bitmap == null) {
            throw Error("Failed to decode EncodedImageData to an Image! (Bytes: ${bytes.size})")
        }
        return HybridImage(bitmap)
    }
    override fun loadFromEncodedImageData(data: EncodedImageData): HybridImageSpec {
        val bytes = data.buffer.toByteArray()
        return loadFromEncodedBytes(bytes)
    }
    override fun loadFromEncodedImageDataAsync(data: EncodedImageData): Promise<HybridImageSpec> {
        return loadFromEncodedImageDataAsync(data, null)
    }
    fun loadFromEncodedImageDataAsync(data: EncodedImageData, targetSize: Size?): Promise<HybridImageSpec> {
        val bytes = data.buffer.toByteArray()
        return Promise.async { loadFromEncodedBytes(bytes, targetSize) }
    }

    override fun loadFromFile(filePath: String): HybridImageSpec {
        return loadFromFile(filePath, null)
    }
    fun loadFromFile(filePath: String, targetSize: Size?): HybridImageSpec {
        val cleanPath = filePath.toFilePath()
        val bitmap = decodeSampledBitmap(targetSize) { options ->
            BitmapFactory.decodeFile(cleanPath, options)
        }
        if (bitmap == null) {
            throw Error("Failed to load Image from file! (Path: $cleanPath)")
        }
        return HybridImage(bitmap)
    }

    override fun loadFromFileAsync(filePath: String): Promise<HybridImageSpec> {
        return loadFromFileAsync(filePath, null)
    }
    fun loadFromFileAsync(filePath: String, targetSize: Size?): Promise<HybridImageSpec> {
        return Promise.async { loadFromFile(filePath, targetSize) }
    }

    private fun loadFromThumbHash(thumbHashBytes: ByteArray): HybridImage {
        val rgba = ThumbHash.thumbHashToRGBA(thumbHashBytes)

        val bitmap = createBitmap(rgba.width, rgba.height, Bitmap.Config.ARGB_8888)
        val buffer = ByteBuffer.wrap(rgba.rgba)
        bitmap.copyPixelsFromBuffer(buffer)
        return HybridImage(bitmap)
    }

    override fun loadFromThumbHash(thumbhash: ArrayBuffer): HybridImageSpec {
        val bytes = thumbhash.toByteArray()
        return loadFromThumbHash(bytes)
    }

    override fun loadFromThumbHashAsync(thumbhash: ArrayBuffer): Promise<HybridImageSpec> {
        // We need to copy before jumping Threads
        val bytes = thumbhash.toByteArray()
        return Promise.async { loadFromThumbHash(bytes) }
    }
}
