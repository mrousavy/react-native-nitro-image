package com.margelo.nitro.image

import android.os.Build
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer
import java.nio.ByteBuffer
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@DoNotStrip
@Keep
class HybridImageUtils: HybridImageUtilsSpec() {
    override val supportsHeicLoading: Boolean
        get() {
            // Since Android 10, HEIF/HEIC is standard.
            // https://source.android.com/docs/core/camera/heif
            return Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
        }
    override val supportsHeicWriting: Boolean
        get() {
            // Android does not support saving HEIF data yet
            return false
        }


    @OptIn(ExperimentalEncodingApi::class)
    override fun thumbHashToBase64String(thumbhash: ArrayBuffer): String {
        val buffer = thumbhash.toByteArray()
        val base64 = Base64.encode(buffer)
        return base64
    }

    @OptIn(ExperimentalEncodingApi::class)
    override fun thumbhashFromBase64String(thumbhashBase64: String): ArrayBuffer {
        val bytes = Base64.decode(thumbhashBase64)
        val buffer = ByteBuffer.wrap(bytes)
        return ArrayBuffer.wrap(buffer)
    }
}
