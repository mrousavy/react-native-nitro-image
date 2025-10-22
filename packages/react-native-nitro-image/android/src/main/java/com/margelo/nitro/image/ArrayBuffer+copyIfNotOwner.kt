package com.margelo.nitro.image

import com.margelo.nitro.core.ArrayBuffer

fun ArrayBuffer.copyIfNotOwner(): ArrayBuffer {
    if (!this.isOwner) {
        return ArrayBuffer.copy(this)
    }
    return this
}
