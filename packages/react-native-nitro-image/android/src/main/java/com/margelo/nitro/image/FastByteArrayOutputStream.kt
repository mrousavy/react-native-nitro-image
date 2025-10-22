package com.margelo.nitro.image

import java.io.OutputStream
import java.nio.ByteBuffer

class FastByteArrayOutputStream(initialSize: Int = 64 * 1024) : OutputStream() {
    var bytes = ByteArray(initialSize)
        private set
    var count = 0
        private set

    override fun write(b: Int) {
        val i = count + 1
        ensureCapacity(i)
        bytes[count] = b.toByte()
        count = i
    }

    override fun write(b: ByteArray, off: Int, len: Int) {
        val i = count + len
        ensureCapacity(i)
        System.arraycopy(b, off, bytes, count, len)
        count = i
    }

    private fun ensureCapacity(min: Int) {
        if (min <= bytes.size) return
        var newCap = bytes.size.coerceAtLeast(1)
        while (newCap < min) newCap = newCap shl 1
        bytes = bytes.copyOf(newCap)
    }

    fun toByteBuffer(): ByteBuffer = ByteBuffer.wrap(bytes, 0, count)
}