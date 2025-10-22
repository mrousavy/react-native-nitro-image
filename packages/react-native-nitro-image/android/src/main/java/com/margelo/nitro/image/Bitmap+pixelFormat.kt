package com.margelo.nitro.image

import android.graphics.Bitmap
import android.hardware.HardwareBuffer
import android.os.Build
import java.nio.ByteOrder

val Bitmap.pixelFormat: PixelFormat
    get() {
        when (config) {
            Bitmap.Config.ARGB_8888 -> {
                // On Android, ARGB_8888 defines memory layout inside an Int, not the byte order.
                // So where iOS would define Pixel Format ARGB as byte order [A, R, G, B],
                // Android instead defines the Pixel Format ARGB as 0xAARRGGBB (32-bit Int) -
                // which - if read on a little-endian machine, is reversed ([B, G, R, A]).
                if (ByteOrder.nativeOrder() == ByteOrder.LITTLE_ENDIAN) {
                    // almost every device nowadays is little endian
                    return PixelFormat.BGRA
                } else {
                    // no devices use big endian anymore, but we keep this to highlight
                    // why ARGB becomes BGRA on little endian.
                    return PixelFormat.ARGB
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
