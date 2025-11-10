package com.margelo.nitro.image

import android.graphics.Bitmap

fun Bitmap.toCpuAccessible(): Bitmap {
    if (this.config == Bitmap.Config.HARDWARE) {
        // HARDWARE isn't CPU-accessible, so we convert to ARGB
        return this.copy(Bitmap.Config.ARGB_8888, true)
    }
    return this
}
