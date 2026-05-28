package com.margelo.nitro.image.extensions

import android.graphics.Bitmap
import com.margelo.nitro.image.PixelFormat

val Bitmap.isRawPixelDataAccessible: Boolean
    get() = !isGPU && pixelFormat != PixelFormat.UNKNOWN
