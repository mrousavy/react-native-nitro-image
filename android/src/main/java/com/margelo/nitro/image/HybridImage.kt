package com.margelo.nitro.image

import android.graphics.Bitmap
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.nio.ByteBuffer

@Suppress("ConvertSecondaryConstructorToPrimary")
@Keep
@DoNotStrip
class HybridImage: HybridImageSpec {
    val bitmap: Bitmap

    override val width: Double
        get() = bitmap.width.toDouble()
    override val height: Double
        get() = bitmap.height.toDouble()

    override val memorySize: Long
        get() = bitmap.allocationByteCount.toLong()

    constructor(bitmap: Bitmap) {
        this.bitmap = bitmap
    }

    override fun toArrayBuffer(): ArrayBuffer {
        val arrayBuffer = ArrayBuffer.allocate(bitmap.byteCount)
        val byteBuffer = arrayBuffer.getBuffer(false)
        bitmap.copyPixelsToBuffer(byteBuffer)
        return arrayBuffer
    }

    override fun toArrayBufferAsync(): Promise<ArrayBuffer> {
        return Promise.async { toArrayBuffer() }
    }

    override fun resize(width: Double, height: Double): HybridImageSpec {
        val resizedBitmap = Bitmap.createScaledBitmap(bitmap, width.toInt(), height.toInt(), true)
        return HybridImage(resizedBitmap)
    }

    override fun resizeAsync(width: Double, height: Double): Promise<HybridImageSpec> {
        return Promise.async { resize(width, height) }
    }

    override fun saveToFileAsync(
        path: String,
        format: ImageFormat,
        quality: Double
    ): Promise<Unit> {
        return Promise.async {
            bitmap.saveToFile(path, format, quality.toInt())
        }
    }

    override fun saveToTemporaryFileAsync(format: ImageFormat, quality: Double): Promise<String> {
        return Promise.async {
            val tempFile = File.createTempFile("nitro_image_", format.name)
            this.saveToFileAsync(tempFile.path, format, quality)
            return@async tempFile.path
        }
    }

    override fun toThumbHash(): ArrayBuffer {
        val bitmapBuffer = ByteBuffer.allocate(bitmap.byteCount)
        bitmap.copyPixelsToBuffer(bitmapBuffer)

        val thumbHash = ThumbHash.rgbaToThumbHash(bitmap.width, bitmap.height, bitmapBuffer.array())
        val buffer = ByteBuffer.wrap(thumbHash)
        return ArrayBuffer.wrap(buffer)
    }

    override fun toThumbHashAsync(): Promise<ArrayBuffer> {
        return Promise.async { toThumbHash() }
    }
}
