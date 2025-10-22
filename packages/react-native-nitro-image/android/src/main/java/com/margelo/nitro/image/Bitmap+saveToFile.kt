package com.margelo.nitro.image

import android.graphics.Bitmap
import java.io.File
import java.io.FileOutputStream

fun ImageFormat.toBitmapFormat(): Bitmap.CompressFormat {
    return when (this) {
        ImageFormat.JPG -> Bitmap.CompressFormat.JPEG
        ImageFormat.PNG -> Bitmap.CompressFormat.PNG
        ImageFormat.HEIC -> {
            throw Error("Saving Images as HEIC is not yet supported on Android!")
        }
    }
}

fun Bitmap.saveToFile(path: String, format: ImageFormat, quality: Int) {
    if (quality < 0 || quality > 100) {
        throw Error("Image quality has to be between 0 and 100! (Received: $quality)")
    }
    // 1. Make sure all parent directories exist
    File(path).parentFile?.mkdirs()
    // 2. Create a file output stream
    FileOutputStream(path).use { out ->
        val bitmapFormat = format.toBitmapFormat()
        val successful = this.compress(bitmapFormat, quality, out)
        if (!successful) {
            throw Error("Failed to compress ${width}x${height} Image to file (\"$path\")! (Format: $format, Quality: $quality)")
        }
    }
}
