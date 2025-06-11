package com.margelo.nitro.image

import android.graphics.Bitmap
import java.io.File
import java.io.FileOutputStream

fun ImageFormat.toBitmapFormat(): Bitmap.CompressFormat {
    return when (this) {
        ImageFormat.JPG -> Bitmap.CompressFormat.JPEG
        ImageFormat.PNG -> Bitmap.CompressFormat.PNG
    }
}

fun Bitmap.saveToFile(path: String, format: ImageFormat, quality: Int) {
    // 1. Make sure all parent directories exist
    File(path).parentFile?.mkdirs()
    // 2. Create a file output stream
    FileOutputStream(path).use { out ->
        val bitmapFormat = format.toBitmapFormat()
        this.compress(bitmapFormat, quality, out)
    }
}
