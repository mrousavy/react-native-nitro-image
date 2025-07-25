package com.margelo.nitro.web.image

import com.margelo.nitro.core.ArrayBuffer
import java.nio.ByteBuffer

fun ArrayBuffer.toByteArray(): ByteArray {
    val buffer = this.getBuffer(false)
    if (buffer.hasArray()) {
        // It's a CPU-backed array - we can return this directly
        return buffer.array()
    }
    // It's not a CPU-backed array (e.g. HardwareBuffer) - we need to copy to the CPU
    val copy = ByteBuffer.allocate(buffer.capacity())
    copy.put(buffer)
    return copy.array()
}
