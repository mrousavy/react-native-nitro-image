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
    val image: Bitmap

    override val width: Double
        get() = image.width.toDouble()
    override val height: Double
        get() = image.height.toDouble()

    constructor(image: Bitmap) {
        this.image = image
    }

    override fun toArrayBuffer(): ArrayBuffer {
        val arrayBuffer = ArrayBuffer.allocate(image.byteCount)
        val byteBuffer = arrayBuffer.getBuffer(false)
        image.copyPixelsToBuffer(byteBuffer)
        return arrayBuffer
    }

    override fun toArrayBufferAsync(): Promise<ArrayBuffer> {
        return Promise.async { toArrayBuffer() }
    }
}
