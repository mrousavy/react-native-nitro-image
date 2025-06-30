package com.margelo.nitro.image

import com.margelo.nitro.core.ArrayBuffer
import java.nio.ByteBuffer
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

class HybridImageUtils: HybridImageUtilsSpec() {
    @OptIn(ExperimentalEncodingApi::class)
    override fun thumbHashToBase64String(thumbhash: ArrayBuffer): String {
        val buffer = thumbhash.getBuffer(false)
        val base64 = Base64.encode(buffer.array())
        return base64
    }

    @OptIn(ExperimentalEncodingApi::class)
    override fun thumbhashFromBase64String(thumbhashBase64: String): ArrayBuffer {
        val bytes = Base64.decode(thumbhashBase64)
        val buffer = ByteBuffer.wrap(bytes)
        return ArrayBuffer.wrap(buffer)
    }
}
