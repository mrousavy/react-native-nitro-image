package com.margelo.nitro.image

import android.graphics.Bitmap
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

fun bitmapFromRawPixelData(data: RawPixelData): Bitmap {
    val w = data.width.toInt()
    val h = data.height.toInt()
    val sw = SW[data.pixelFormat] ?: throw Error("Unsupported Pixel Format: ${data.pixelFormat}")
    val stride = w * sw.bpp
    val buffer = data.buffer.getBuffer(false)
    buffer.rewind()
    if (buffer.remaining() < stride * h) {
        throw Error("ByteBuffer is too small! (Remaining: ${buffer.remaining()}/${buffer.capacity()}, Expected Bytes: ${stride * h})")
    }

    val out = IntArray(w * h)

    fun packPremul(r: Int, g: Int, b_: Int, a: Int): Int {
        val a8 = if (a < 0) 0xFF else a
        val rr = if (a8 == 255) r else (r * a8 + 127) / 255
        val gg = if (a8 == 255) g else (g * a8 + 127) / 255
        val bb = if (a8 == 255) b_ else (b_ * a8 + 127) / 255
        return (a8 shl 24) or (rr shl 16) or (gg shl 8) or bb
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
                val ch = intArrayOf(b0, b1, b2, b3)
                val r = ch[sw.r]; val g = ch[sw.g]; val bl = ch[sw.b]
                val a = if (sw.a >= 0) ch[sw.a] else 255
                out[di++] = packPremul(r, g, bl, a)
            }
        }
    } else { // 3 bpp
        for (y in 0 until h) {
            val row = y * stride
            for (x in 0 until w) {
                val p = row + x * 3
                val b0 = buffer.get(p).toInt() and 0xFF
                val b1 = buffer.get(p + 1).toInt() and 0xFF
                val b2 = buffer.get(p + 2).toInt() and 0xFF
                val ch = intArrayOf(b0, b1, b2)
                val r = ch[sw.r]; val g = ch[sw.g]; val bl = ch[sw.b]
                out[di++] = packPremul(r, g, bl, 255)
            }
        }
    }

    val bitmap = createBitmap(w, h, Bitmap.Config.ARGB_8888)
    bitmap.isPremultiplied = true
    bitmap.copyPixelsFromBuffer(IntBuffer.wrap(out))
    return bitmap
}