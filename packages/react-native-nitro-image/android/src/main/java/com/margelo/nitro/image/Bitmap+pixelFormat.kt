package com.margelo.nitro.image

import android.graphics.Bitmap
import android.hardware.HardwareBuffer
import android.os.Build

val Bitmap.pixelFormat: PixelFormat
    get() {
        when (config) {
            Bitmap.Config.ARGB_8888 -> {
                // ARGB_8888 is BGRA on Android (because of little endian)
                return PixelFormat.BGRA
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
