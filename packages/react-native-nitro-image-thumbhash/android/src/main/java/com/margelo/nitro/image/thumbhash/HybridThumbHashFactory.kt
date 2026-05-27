package com.margelo.nitro.image.thumbhash

import android.graphics.Bitmap
import androidx.annotation.Keep
import androidx.core.graphics.createBitmap
import com.facebook.proguard.annotations.DoNotStrip
import com.madebyevan.thumbhash.ThumbHash
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImage
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.extensions.toByteBuffer
import java.nio.ByteBuffer
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@DoNotStrip
@Keep
class HybridThumbHashFactory : HybridThumbHashFactorySpec() {
    override fun encode(image: HybridImageSpec): ArrayBuffer {
        val native = image as? HybridImage
            ?: throw Error("The given image ($image) is not a `HybridImage` and cannot be encoded to a ThumbHash!")
        val bitmap = native.bitmap
        if (bitmap.width > 100 || bitmap.height > 100) {
            throw Error("Cannot encode an Image larger than 100x100 to a ThumbHash. " +
                    "Resize the image to <100 pixels in width and height first, then try again!")
        }
        val bitmapBuffer = bitmap.toByteBuffer()
        val thumbHash = ThumbHash.rgbaToThumbHash(bitmap.width, bitmap.height, bitmapBuffer.array())
        val buffer = ByteBuffer.wrap(thumbHash)
        return ArrayBuffer.copy(buffer)
    }

    override fun encodeAsync(image: HybridImageSpec): Promise<ArrayBuffer> {
        return Promise.async { encode(image) }
    }

    private fun decode(bytes: ByteArray): HybridImage {
        val rgba = ThumbHash.thumbHashToRGBA(bytes)
        val bitmap = createBitmap(rgba.width, rgba.height, Bitmap.Config.ARGB_8888)
        val buffer = ByteBuffer.wrap(rgba.rgba)
        bitmap.copyPixelsFromBuffer(buffer)
        return HybridImage(bitmap)
    }

    override fun decode(thumbhash: ArrayBuffer): HybridImageSpec {
        val bytes = thumbhash.toByteArray()
        return decode(bytes)
    }

    override fun decodeAsync(thumbhash: ArrayBuffer): Promise<HybridImageSpec> {
        val bytes = thumbhash.toByteArray()
        return Promise.async { decode(bytes) }
    }

    @OptIn(ExperimentalEncodingApi::class)
    override fun toBase64String(thumbhash: ArrayBuffer): String {
        val buffer = thumbhash.toByteArray()
        return Base64.encode(buffer)
    }

    @OptIn(ExperimentalEncodingApi::class)
    override fun fromBase64String(thumbhashBase64: String): ArrayBuffer {
        val bytes = Base64.decode(thumbhashBase64)
        return ArrayBuffer.copy(bytes)
    }
}
