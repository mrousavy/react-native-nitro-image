package com.margelo.nitro.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.currentCoroutineContext
import java.util.concurrent.PriorityBlockingQueue
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import kotlin.coroutines.CoroutineContext
import kotlin.math.max

private object PriorityDispatchers {
    private val coreCount = Runtime.getRuntime().availableProcessors()
    private val threadCounter = AtomicInteger(0)

    // Create separate thread pools with different configurations
    private val highPriorityExecutor = ThreadPoolExecutor(
        max(coreCount / 4, 2), // core pool size
        coreCount, // maximum pool size
        60L, TimeUnit.SECONDS,
        PriorityBlockingQueue()
    ) { runnable ->
        Thread(runnable).apply {
            name = "ImageLoader-HIGH-${threadCounter.incrementAndGet()}"
            priority = Thread.MAX_PRIORITY
        }
    }

    private val lowPriorityDispatcher = Dispatchers.IO.limitedParallelism(2)

    val HIGH = highPriorityExecutor.asCoroutineDispatcher()
    val LOW = lowPriorityDispatcher
}


suspend fun AsyncImagePriority.toCoroutineContext(): CoroutineContext {
    return when (this) {
        AsyncImagePriority.LOW -> PriorityDispatchers.LOW
        AsyncImagePriority.DEFAULT -> currentCoroutineContext()
        AsyncImagePriority.HIGH -> PriorityDispatchers.HIGH
    }
}