package com.margelo.nitro.image

import android.graphics.Bitmap
import java.nio.ByteBuffer

fun Bitmap.compressInMemory(format: ImageFormat, quality: Int): ByteBuffer {
    if (quality < 0 || quality > 100) {
        throw Error("Image quality has to be between 0 and 100! (Received: $quality)")
    }
    val estimatedByteSize = when (format) {
        ImageFormat.JPG -> (width * height) / 2
        ImageFormat.PNG -> width * height
        ImageFormat.HEIC -> width * height
    }

    FastByteArrayOutputStream(estimatedByteSize).use { out ->
        val successful = this.compress(format.toBitmapFormat(), quality, out)
        if (!successful) {
            throw Error("Failed to compress the Bitmap into EncodedImageData! (Format: ${format.name}, " +
                    "Quality: ${quality}, Written Bytes: ${out.count})")
        }
        return out.toByteBuffer()
    }
}
