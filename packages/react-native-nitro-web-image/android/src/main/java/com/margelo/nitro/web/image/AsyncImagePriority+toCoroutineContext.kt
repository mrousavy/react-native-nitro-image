package com.margelo.nitro.web.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.currentCoroutineContext
import kotlin.coroutines.CoroutineContext


fun AsyncImagePriority.toCoroutineContext(): CoroutineContext? {
    // TODO: Does this look about right?
    return when (this) {
        AsyncImagePriority.LOW -> Dispatchers.IO.limitedParallelism(2)
        AsyncImagePriority.DEFAULT -> null
        AsyncImagePriority.HIGH -> Dispatchers.IO
    }
}
