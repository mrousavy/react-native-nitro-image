package com.margelo.nitro.image

import com.margelo.nitro.core.ArrayBuffer
import java.nio.ByteBuffer

fun ArrayBuffer.toByteArray(): ByteArray {
    val buffer = this.getBuffer(false)
    if (buffer.hasArray()) {
        // It's a CPU-backed array - we can return this directly
        val array = buffer.array()
        if (array.size == this.size) {
            // The CPU-backed array is exactly the view we have in our ArrayBuffer.
            // Return as is!
            return array
        }
        // we had a CPU-backed array, but it's size differs from our ArrayBuffer size.
        // This might be because the ArrayBuffer has a smaller view of the data, so we need
        // to resort back to a good ol' copy.
    }
    // It's not a CPU-backed array (e.g. HardwareBuffer) - we need to copy to the CPU
    val copy = ByteBuffer.allocate(buffer.capacity())
    copy.put(buffer)
    return copy.array()
}
