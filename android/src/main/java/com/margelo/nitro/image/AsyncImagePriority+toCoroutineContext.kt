package com.margelo.nitro.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import java.util.concurrent.LinkedBlockingDeque
import java.util.concurrent.PriorityBlockingQueue
import java.util.concurrent.ThreadFactory
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import kotlin.coroutines.CoroutineContext

private object PriorityDispatchers {
    // Create separate thread pools with different configurations
    private val highPriorityExecutor = ThreadPoolExecutor(
        4, // core pool size
        8, // maximum pool size
        60L, TimeUnit.SECONDS,
        PriorityBlockingQueue<Runnable>(),
        ThreadFactory { runnable ->
            Thread(runnable).apply {
                name = "ImageLoader-HIGH-${threadCounter.incrementAndGet()}"
                priority = Thread.MAX_PRIORITY // 10
            }
        }
    )

    private val defaultPriorityExecutor = ThreadPoolExecutor(
        2, // core pool size
        4, // maximum pool size
        60L, TimeUnit.SECONDS,
        LinkedBlockingDeque<Runnable>(),
        ThreadFactory { runnable ->
            Thread(runnable).apply {
                name = "ImageLoader-DEFAULT-${threadCounter.incrementAndGet()}"
                priority = Thread.NORM_PRIORITY // 5
            }
        }
    )

    // Use limited parallelism for low priority to avoid resource contention
    private val lowPriorityDispatcher = Dispatchers.IO.limitedParallelism(2)

    private val threadCounter = AtomicInteger(0)

    // Convert executors to dispatchers
    val HIGH = highPriorityExecutor.asCoroutineDispatcher()
    val DEFAULT = defaultPriorityExecutor.asCoroutineDispatcher()
    val LOW = lowPriorityDispatcher
}


fun AsyncImagePriority.toCoroutineContext(): CoroutineContext {
    return when (this) {
        AsyncImagePriority.LOW -> PriorityDispatchers.LOW
        AsyncImagePriority.DEFAULT -> PriorityDispatchers.DEFAULT
        AsyncImagePriority.HIGH -> PriorityDispatchers.HIGH
    }
}