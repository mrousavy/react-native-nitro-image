package com.margelo.nitro.image

fun Color.toBitmapColor(): Int {
    if (a != null) {
        // We have an alpha Channel
        return android.graphics.Color.argb(a.toFloat(), r.toFloat(), g.toFloat(), b.toFloat())
    } else {
        // We don't have an alpha channel
        return android.graphics.Color.rgb(r.toFloat(), g.toFloat(), b.toFloat())
    }
}
