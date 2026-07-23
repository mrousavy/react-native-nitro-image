package com.margelo.nitro.image.extensions

import android.graphics.Bitmap
import android.hardware.HardwareBuffer
import android.os.Build
import com.margelo.nitro.image.PixelFormat
import java.nio.ByteOrder

val Bitmap.pixelFormat: PixelFormat
    get() {
        when (config) {
            Bitmap.Config.ARGB_8888 -> {
                // Despite its name, ARGB_8888 does NOT describe the byte order in memory.
                // "0xAARRGGBB" is only the ColorInt packing used by getPixel()/setPixel().
                // Each pixel is actually stored as a 32-bit word with R in the least
                // significant byte (0xAABBGGRR). toRawPixelData() exports via
                // copyPixelsToBuffer() - a raw memory copy - so the exported bytes are the
                // physical memory layout of that word.
                if (ByteOrder.nativeOrder() == ByteOrder.LITTLE_ENDIAN) {
                    // almost every device nowadays is little endian:
                    // the 0xAABBGGRR word lays out as [R, G, B, A] bytes.
                    return PixelFormat.RGBA
                } else {
                    // no devices use big endian anymore, but we keep this to highlight
                    // that the 0xAABBGGRR word would lay out as [A, B, G, R] bytes there.
                    return PixelFormat.ABGR
                }
            }
            Bitmap.Config.HARDWARE -> {
                // Hardware Buffer is either RGBA or RGBX
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    when (hardwareBuffer.format) {
                        HardwareBuffer.RGBA_8888 -> return PixelFormat.RGBA
                        HardwareBuffer.RGBX_8888 -> return PixelFormat.RGBX
                        HardwareBuffer.RGB_888 -> return PixelFormat.RGB
                    }
                }
                return PixelFormat.UNKNOWN
            }
            else -> return PixelFormat.UNKNOWN
        }
    }
