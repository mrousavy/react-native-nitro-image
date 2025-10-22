package com.margelo.nitro.image

import android.graphics.Bitmap
import android.graphics.ColorSpace
import android.os.Build
import androidx.core.graphics.createBitmap
import java.io.File
import java.io.FileOutputStream
import java.nio.IntBuffer

private data class Swizzle(val r: Int, val g: Int, val b: Int, val a: Int, val bpp: Int)

private val SW = mapOf(
    PixelFormat.ARGB to Swizzle(1,2,3,0,4), // A R G B
    PixelFormat.BGRA to Swizzle(2,1,0,3,4), // B G R A
    PixelFormat.ABGR to Swizzle(3,2,1,0,4), // A B G R
    PixelFormat.RGBA to Swizzle(0,1,2,3,4), // R G B A
    PixelFormat.XRGB to Swizzle(1,2,3,-1,4),// X R G B
    PixelFormat.BGRX to Swizzle(2,1,0,-1,4),// B G R X
    PixelFormat.XBGR to Swizzle(3,2,1,-1,4),// X B G R
    PixelFormat.RGBX to Swizzle(0,1,2,-1,4),// R G B X
    PixelFormat.RGB  to Swizzle(0,1,2,-1,3),// R G B
    PixelFormat.BGR  to Swizzle(2,1,0,-1,3) // B G R
)

fun bitmapFromRawPixelData(data: RawPixelData, allowGpu: Boolean): Bitmap {
    if (allowGpu) {
        // FAST PATH: Try using GPU Buffer (HardwareBuffer) if it is one. This is zero-copy!
        if (data.buffer.isHardwareBuffer && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val bitmap = Bitmap.wrapHardwareBuffer(data.buffer.getHardwareBuffer(), ColorSpace.get(ColorSpace.Named.SRGB))
            if (bitmap != null) {
                return bitmap
            }
        }
    }

    // SLOW PATH: Perform a CPU copy of the Buffer and read byte by byte into a Bitmap
    val w = data.width.toInt()
    val h = data.height.toInt()
    val sw =
        SW[data.pixelFormat] ?: throw Error("Unsupported Pixel Format: ${data.pixelFormat}")
    val stride = w * sw.bpp

    val buffer = data.buffer.getBuffer(false)
    buffer.rewind()
    if (buffer.remaining() < stride * h) {
        throw Error("ByteBuffer is too small! (Remaining: ${buffer.remaining()}/${buffer.capacity()}, Expected Bytes: ${stride * h})")
    }

    val out = IntArray(w * h)

    fun pack(r: Int, g: Int, b_: Int, aIn: Int, srcPremul: Boolean): Int {
        val a = if (aIn < 0) 0xFF else aIn
        val rr = if (srcPremul || a == 255) r else (r * a + 127) / 255
        val gg = if (srcPremul || a == 255) g else (g * a + 127) / 255
        val bb = if (srcPremul || a == 255) b_ else (b_ * a + 127) / 255
        return (a shl 24) or (rr shl 16) or (gg shl 8) or bb
    }

    var di = 0
    if (sw.bpp == 4) {
        for (y in 0 until h) {
            val row = y * stride
            for (x in 0 until w) {
                val p = row + x * 4
                val b0 = buffer.get(p).toInt() and 0xFF
                val b1 = buffer.get(p + 1).toInt() and 0xFF
                val b2 = buffer.get(p + 2).toInt() and 0xFF
                val b3 = buffer.get(p + 3).toInt() and 0xFF
                val r = when (sw.r) {0->b0;1->b1;2->b2;else->b3}
                val g = when (sw.g) {0->b0;1->b1;2->b2;else->b3}
                val bl= when (sw.b) {0->b0;1->b1;2->b2;else->b3}
                val a  = if (sw.a >= 0) when(sw.a){0->b0;1->b1;2->b2;else->b3} else 255
                val srcPremul = sw.a >= 0
                out[di++] = pack(r, g, bl, a, srcPremul)
            }
        }
    } else {
        for (y in 0 until h) {
            val row = y * stride
            for (x in 0 until w) {
                val p = row + x * 3
                val b0 = buffer.get(p).toInt() and 0xFF
                val b1 = buffer.get(p + 1).toInt() and 0xFF
                val b2 = buffer.get(p + 2).toInt() and 0xFF
                val r = when (sw.r) {0->b0;1->b1;else->b2}
                val g = when (sw.g) {0->b0;1->b1;else->b2}
                val bl= when (sw.b) {0->b0;1->b1;else->b2}
                out[di++] = pack(r, g, bl, 255, true) // opaque => already "premultiplied"
            }
        }
    }

    val bitmap = createBitmap(w, h, Bitmap.Config.ARGB_8888)
    bitmap.isPremultiplied = true
    bitmap.copyPixelsFromBuffer(IntBuffer.wrap(out))
    return bitmap
}