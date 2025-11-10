package com.margelo.nitro.image

import android.graphics.Bitmap

fun Bitmap.toMutable(forceCopy: Boolean): Bitmap {
    if (isMutable && !forceCopy) {
        // It's already Mutable!
        return this
    }
    var config = this.config ?: throw Error("Failed to get Bitmap's format! $this")
    if (config == Bitmap.Config.HARDWARE) {
        // HARDWARE Bitmaps are not mutable, so we need to change to ARGB
        config = Bitmap.Config.ARGB_8888
    }
    return this.copy(config, true)
}
