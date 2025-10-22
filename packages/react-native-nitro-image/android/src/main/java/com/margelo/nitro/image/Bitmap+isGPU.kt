package com.margelo.nitro.image

import android.graphics.Bitmap
import android.os.Build

val Bitmap.isGPU: Boolean
    get() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                this.config == Bitmap.Config.HARDWARE
    }
