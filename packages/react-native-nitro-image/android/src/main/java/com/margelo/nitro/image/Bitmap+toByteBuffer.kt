package com.margelo.nitro.image

import android.graphics.Bitmap
import java.nio.ByteBuffer

fun Bitmap.toByteBuffer(): ByteBuffer {
    var bitmap = this
    if (isGPU) {
        // It's a GPU Bitmap - we need to copy it to CPU memory first.
        bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, false)
    }

    val buffer = ByteBuffer.allocateDirect(bitmap.byteCount)
    bitmap.copyPixelsToBuffer(buffer)
    buffer.rewind()
    return buffer
}
