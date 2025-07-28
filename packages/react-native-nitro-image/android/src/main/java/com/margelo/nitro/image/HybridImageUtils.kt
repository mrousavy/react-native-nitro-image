package com.margelo.nitro.image

import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer
import java.nio.ByteBuffer
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@DoNotStrip
@Keep
class HybridImageUtils: HybridImageUtilsSpec() {
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
