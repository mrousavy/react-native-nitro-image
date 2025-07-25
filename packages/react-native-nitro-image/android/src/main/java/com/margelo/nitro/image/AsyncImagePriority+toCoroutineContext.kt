package com.margelo.nitro.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.currentCoroutineContext
import kotlin.coroutines.CoroutineContext


suspend fun AsyncImagePriority.toCoroutineContext(): CoroutineContext {
    return when (this) {
        AsyncImagePriority.LOW -> Dispatchers.IO.limitedParallelism(2)
        AsyncImagePriority.DEFAULT -> currentCoroutineContext()
        AsyncImagePriority.HIGH -> Dispatchers.IO
    }
}