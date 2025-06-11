package com.margelo.nitro.image

import android.graphics.Bitmap
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise

@Suppress("ConvertSecondaryConstructorToPrimary")
@Keep
@DoNotStrip
class HybridImage: HybridImageSpec {
    val bitmap: Bitmap

    override val width: Double
        get() = bitmap.width.toDouble()
    override val height: Double
        get() = bitmap.height.toDouble()

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
        val resizedBitmap = Bitmap.createScaledBitmap(bitmap, width.toInt(), height.toInt(), false)
        return HybridImage(resizedBitmap)
    }

    override fun resizeAsync(width: Double, height: Double): Promise<HybridImageSpec> {
        return Promise.async { resize(width, height) }
    }
}
