package com.margelo.nitro.image

import android.graphics.Bitmap
import android.os.Build
import androidx.annotation.Keep
import androidx.core.graphics.scale
import com.facebook.common.memory.PooledByteBufferOutputStream
import com.facebook.proguard.annotations.DoNotStrip
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import java.io.ByteArrayOutputStream
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

    override fun toRawPixelData(allowGpu: Boolean?): RawPixelData {
        val allowGpu = allowGpu ?: false
        if (allowGpu && bitmap.isGPU && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Wrap the existing GPU buffer (HardwareBuffer)
            val arrayBuffer = ArrayBuffer.wrap(bitmap.hardwareBuffer)
            return RawPixelData(arrayBuffer, width, height, bitmap.pixelFormat)
        } else {
            // Copy the data into a CPU buffer (ByteBuffer)
            var bitmap = bitmap
            if (bitmap.isGPU) {
                // If this is a GPU-based bitmap (but we cannot use GPU), copy it to a CPU Bitmap first
                bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, false)
            }
            val buffer = bitmap.toByteBuffer()
            val arrayBuffer = ArrayBuffer.wrap(buffer)
            return RawPixelData(arrayBuffer, width, height, bitmap.pixelFormat)
        }
    }
    override fun toRawPixelDataAsync(allowGpu: Boolean?): Promise<RawPixelData> {
        return Promise.async { toRawPixelData(allowGpu) }
    }

    override fun toEncodedImageData(format: ImageFormat, quality: Double?): EncodedImageData {
        val quality = quality ?: 1.0
        val estimatedByteSize = when (format) {
            ImageFormat.JPG -> (width * height) / 2
            ImageFormat.PNG -> width * height
        }
        val outputStream = FastByteArrayOutputStream(estimatedByteSize.toInt())
        val successful = bitmap.compress(format.toBitmapFormat(), quality.toInt(), outputStream)
        if (!successful) {
            throw Error("Failed to compress the Bitmap into EncodedImageData! (Format: ${format.name}, " +
                    "Quality: ${quality}, Written Bytes: ${outputStream.count})")
        }
        val byteBuffer = outputStream.toByteBuffer()
        val arrayBuffer = ArrayBuffer.wrap(byteBuffer)
        return EncodedImageData(arrayBuffer, width, height, format)
    }
    override fun toEncodedImageDataAsync(
        format: ImageFormat,
        quality: Double?
    ): Promise<EncodedImageData> {
        return Promise.async { toEncodedImageData(format, quality) }
    }

    override fun resize(width: Double, height: Double): HybridImageSpec {
        if (width < 0) {
            throw Error("Width cannot be less than 0! (width: $width)")
        }
        if (height < 0) {
            throw Error("Height cannot be less than 0! (height: $height)")
        }
        val resizedBitmap = bitmap.scale(width.toInt(), height.toInt(), true)
        return HybridImage(resizedBitmap)
    }
    override fun resizeAsync(width: Double, height: Double): Promise<HybridImageSpec> {
        return Promise.async { resize(width, height) }
    }

    override fun crop(startX: Double, startY: Double, endX: Double, endY: Double): HybridImageSpec {
        val width = endX - startX
        val height = endY - startY
        if (width < 0) {
            throw Error("Width cannot be less than 0! (startX: $startX - endX: $endX = $width)")
        }
        if (height < 0) {
            throw Error("Height cannot be less than 0! (startY: $startY - endY: $endY = $height)")
        }
        val croppedBitmap = Bitmap.createBitmap(
            bitmap,
            startX.toInt(),
            startY.toInt(),
            width.toInt(),
            height.toInt()
        )
        return HybridImage(croppedBitmap)
    }

    override fun cropAsync(
        startX: Double,
        startY: Double,
        endX: Double,
        endY: Double
    ): Promise<HybridImageSpec> {
        return Promise.async { crop(startX, startY, endX, endY) }
    }

    override fun saveToFileAsync(
        path: String,
        format: ImageFormat,
        quality: Double?
    ): Promise<Unit> {
        val quality = quality ?: 1.0
        return Promise.async {
            bitmap.saveToFile(path, format, quality.toInt())
        }
    }

    override fun saveToTemporaryFileAsync(format: ImageFormat, quality: Double?): Promise<String> {
        return Promise.async {
            val tempFile = File.createTempFile("nitro_image_", format.name)
            this.saveToFileAsync(tempFile.path, format, quality)
            return@async tempFile.path
        }
    }

    override fun toThumbHash(): ArrayBuffer {
        if (width > 100 || height > 100) {
            throw Error("Cannot encode an Image larger than 100x100 to a ThumbHash. " +
                    "Resize the image to <100 pixels in width and height first, then try again!")
        }

        val bitmapBuffer = bitmap.toByteBuffer()

        val thumbHash = ThumbHash.rgbaToThumbHash(bitmap.width, bitmap.height, bitmapBuffer.array())
        val buffer = ByteBuffer.wrap(thumbHash)
        return ArrayBuffer.copy(buffer)
    }

    override fun toThumbHashAsync(): Promise<ArrayBuffer> {
        return Promise.async { toThumbHash() }
    }
}
