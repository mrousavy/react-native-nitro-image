package com.margelo.nitro.image.extensions

import android.net.Uri

internal fun String.toFilePath(): String {
    if (!startsWith("file://")) {
        return this
    }

    val uri = Uri.parse(this)
    return uri.path?.takeIf { it.isNotEmpty() } ?: removePrefix("file://")
}
