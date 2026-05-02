package com.margelo.nitro.image

import android.graphics.Bitmap
import android.util.Log
import android.util.LruCache
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import java.util.WeakHashMap
import kotlin.math.max

internal object RenderBitmapMemoryCache {
    private const val TAG = "RenderBitmapMemoryCache"

    // Keep this conservative first. Raise later once behavior is stable.
    private const val MAX_CACHE_KB = 96 * 1024

    private val lock = Any()
    private val activeCounts = HashMap<String, Int>()
    private val pendingEvictions = HashMap<String, MutableList<Bitmap>>()

    private val cache = object : LruCache<String, Bitmap>(MAX_CACHE_KB) {
        override fun sizeOf(key: String, value: Bitmap): Int {
            return max(1, value.allocationByteCount / 1024)
        }

        override fun entryRemoved(
            evicted: Boolean,
            key: String,
            oldValue: Bitmap,
            newValue: Bitmap?
        ) {
            if (oldValue === newValue) {
                return
            }

            recycleOrDefer(key, oldValue, "cache eviction")
        }
    }

    fun getAndAcquire(key: String): Bitmap? {
        synchronized(lock) {
            val bitmap = cache.get(key)

            if (bitmap == null || bitmap.isRecycled) {
                if (bitmap != null) {
                    cache.remove(key)
                }
                return null
            }

            activeCounts[key] = (activeCounts[key] ?: 0) + 1

            
            return bitmap
        }
    }

    fun putAndAcquire(key: String, bitmap: Bitmap): Bitmap {
        synchronized(lock) {
            val existing = cache.get(key)

            if (existing != null && !existing.isRecycled) {
                activeCounts[key] = (activeCounts[key] ?: 0) + 1

                if (existing !== bitmap) {
                    recycleBitmap(bitmap, "duplicate decoded bitmap discarded")
                }

                
                return existing
            }

            activeCounts[key] = (activeCounts[key] ?: 0) + 1
            cache.put(key, bitmap)

            
            return bitmap
        }
    }

    fun release(key: String) {
        val evictedToRecycle = mutableListOf<Bitmap>()

        synchronized(lock) {
            val current = activeCounts[key] ?: return
            val next = current - 1

            if (next > 0) {
                activeCounts[key] = next
                                return
            }

            activeCounts.remove(key)

            pendingEvictions.remove(key)?.let { pending ->
                evictedToRecycle.addAll(pending)
            }

                    }

        evictedToRecycle.forEach { bitmap ->
            recycleBitmap(bitmap, "deferred cache eviction release")
        }
    }

    private fun recycleOrDefer(key: String, bitmap: Bitmap, reason: String) {
        synchronized(lock) {
            val activeCount = activeCounts[key] ?: 0

            if (activeCount > 0) {
                val pending = pendingEvictions[key] ?: mutableListOf<Bitmap>().also {
                    pendingEvictions[key] = it
                }
                pending.add(bitmap)

                
                return
            }
        }

        recycleBitmap(bitmap, reason)
    }

    private fun recycleBitmap(bitmap: Bitmap, reason: String) {
        try {
            if (!bitmap.isRecycled) {
                bitmap.recycle()
            }
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to recycle cached Bitmap! reason=$reason", e)
        }
    }
}

internal object RenderBitmapDecodeCoordinator {
    private const val TAG = "RenderBitmapDecodeCoordinator"

    private val lock = Any()
    private val inFlight = HashMap<String, CompletableDeferred<Bitmap>>()

    fun getOrCreate(key: String): Pair<CompletableDeferred<Bitmap>, Boolean> {
        synchronized(lock) {
            val existing = inFlight[key]
            if (existing != null) {
                                return existing to false
            }

            val deferred = CompletableDeferred<Bitmap>()
            inFlight[key] = deferred
                        return deferred to true
        }
    }

    fun complete(key: String, bitmap: Bitmap) {
        val deferred = synchronized(lock) {
            inFlight.remove(key)
        }

        deferred?.complete(bitmap)
    }

    fun fail(key: String, throwable: Throwable) {
        val deferred = synchronized(lock) {
            inFlight.remove(key)
        }

        deferred?.completeExceptionally(throwable)
    }
}

@Keep
@DoNotStrip
class HybridImageLoader(
    private val loadImageFunc: (targetWidth: Int?, targetHeight: Int?) -> Promise<HybridImageSpec>,
    private val allowCaching: Boolean = true,
    private val renderCacheKey: String? = null,
    private val renderBitmapFunc: ((targetWidth: Int?, targetHeight: Int?) -> Bitmap)? = null
) : HybridImageLoaderSpec() {
    companion object {
        private const val TAG = "HybridImageLoader"
    }

    private data class CacheKey(
        val targetWidth: Int?,
        val targetHeight: Int?
    )

    private var cachedResult: HybridImageSpec? = null
    private var cachedKey: CacheKey? = null
    private var isDisposed = false

    private val ioScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val uiScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private val pendingJobs = WeakHashMap<HybridImageView, MutableList<Job>>()
    private val requestGenerations = WeakHashMap<HybridImageView, Int>()
    private val displayedHybridImages = WeakHashMap<HybridImageView, HybridImage>()

    override fun dispose() {
        isDisposed = true

        pendingJobs.values.forEach { jobs ->
            jobs.forEach { job -> job.cancel() }
        }

        pendingJobs.clear()
        requestGenerations.clear()

        releaseAllDisplayedHybridImages()

        cachedResult = null
        cachedKey = null

        ioScope.cancel()
        uiScope.cancel()
    }

    override fun loadImage(): Promise<HybridImageSpec> {
        return loadImage(null, null)
    }

    private fun loadImage(targetWidth: Int?, targetHeight: Int?): Promise<HybridImageSpec> {
        if (isDisposed) {
            throw Error("Cannot load image from a disposed HybridImageLoader!")
        }

        val key = CacheKey(targetWidth, targetHeight)

        if (allowCaching) {
            val result = cachedResult
            if (result != null && cachedKey == key) {
                return Promise.resolved(result)
            }

            return loadImageFunc(targetWidth, targetHeight)
                .then { image ->
                    if (!isDisposed) {
                        cachedResult = image
                        cachedKey = key
                    }
                }
        }

        return loadImageFunc(targetWidth, targetHeight)
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return

        
        val renderFunc = renderBitmapFunc
        if (renderFunc != null) {
            requestRenderBitmap(view, renderFunc)
            return
        }

        requestHybridImage(view)
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return

        
        invalidateRequest(view)

        uiScope.launch {
            val clearedRenderBitmap = view.clearRenderBitmapForOwner(
                this@HybridImageLoader,
                "dropImage"
            )
            val clearedHybridImage = releaseDisplayedHybridImage(view)

            if (clearedHybridImage && !clearedRenderBitmap) {
                view.imageView.setImageDrawable(null)
            }

            if (!clearedRenderBitmap &&
                !clearedHybridImage &&
                view.isCurrentImageLoader(this@HybridImageLoader)
            ) {
                view.imageView.setImageDrawable(null)
            }

            removeCompletedJobs(view)
        }

        if (!allowCaching) {
            cachedResult = null
            cachedKey = null
        }
    }

    private fun requestRenderBitmap(
        view: HybridImageView,
        renderFunc: (targetWidth: Int?, targetHeight: Int?) -> Bitmap
    ) {
        val generation = nextGeneration(view)
        val targetWidth = view.targetImageWidth()
        val targetHeight = view.targetImageHeight()
        val cacheKey = buildRenderCacheKey(targetWidth, targetHeight)

        if (cacheKey != null) {
            val cachedBitmap = RenderBitmapMemoryCache.getAndAcquire(cacheKey)
            if (cachedBitmap != null) {
                uiScope.launch {
                    if (
                        isDisposed ||
                        !isCurrentRequest(view, generation) ||
                        !view.isCurrentImageLoader(this@HybridImageLoader)
                    ) {
                        RenderBitmapMemoryCache.release(cacheKey)
                        removeCompletedJobs(view)
                        return@launch
                    }

                    releaseDisplayedHybridImage(view)
                    view.setRenderBitmap(
                        owner = this@HybridImageLoader,
                        bitmap = cachedBitmap,
                        cacheKey = cacheKey
                    )

                    removeCompletedJobs(view)
                }
                return
            }
        }

        val job = ioScope.launch {
            var decodedBitmap: Bitmap? = null
            var acquiredCacheKey: String? = null

            try {
                val loadedBitmap = if (cacheKey != null) {
                    acquiredCacheKey = cacheKey
                    getOrDecodeCachedBitmap(
                        cacheKey = cacheKey,
                        targetWidth = targetWidth,
                        targetHeight = targetHeight,
                        renderFunc = renderFunc
                    )
                } else {
                    renderFunc(targetWidth, targetHeight)
                }

                decodedBitmap = loadedBitmap

                uiScope.launch {
                    val bitmapToAssign = decodedBitmap
                    decodedBitmap = null

                    if (bitmapToAssign == null) {
                        removeCompletedJobs(view)
                        return@launch
                    }

                    try {
                        if (
                            isDisposed ||
                            !isCurrentRequest(view, generation) ||
                            !view.isCurrentImageLoader(this@HybridImageLoader)
                        ) {
                            releaseOrRecycleBitmap(
                                bitmap = bitmapToAssign,
                                cacheKey = acquiredCacheKey,
                                reason = "stale render decode"
                            )
                            removeCompletedJobs(view)
                            return@launch
                        }

                        releaseDisplayedHybridImage(view)

                        view.setRenderBitmap(
                            owner = this@HybridImageLoader,
                            bitmap = bitmapToAssign,
                            cacheKey = acquiredCacheKey
                        )

                        removeCompletedJobs(view)
                    } catch (e: Throwable) {
                        releaseOrRecycleBitmap(
                            bitmap = bitmapToAssign,
                            cacheKey = acquiredCacheKey,
                            reason = "failed render assignment"
                        )

                        Log.e(TAG, "Failed to assign render Bitmap!", e)
                        removeCompletedJobs(view)
                    }
                }
            } catch (e: Throwable) {
                val bitmapToRelease = decodedBitmap
                decodedBitmap = null

                if (bitmapToRelease != null) {
                    releaseOrRecycleBitmap(
                        bitmap = bitmapToRelease,
                        cacheKey = acquiredCacheKey,
                        reason = "failed render decode"
                    )
                }

                Log.e(TAG, "Failed to request render Bitmap!", e)
                removeCompletedJobs(view)
            }
        }

        addPendingJob(view, job)
    }

    private suspend fun getOrDecodeCachedBitmap(
        cacheKey: String,
        targetWidth: Int,
        targetHeight: Int,
        renderFunc: (targetWidth: Int?, targetHeight: Int?) -> Bitmap
    ): Bitmap {
        RenderBitmapMemoryCache.getAndAcquire(cacheKey)?.let { cached ->
            return cached
        }

        val (deferred, isOwner) = RenderBitmapDecodeCoordinator.getOrCreate(cacheKey)

        if (isOwner) {
            try {
                val decoded = renderFunc(targetWidth, targetHeight)
                val cached = RenderBitmapMemoryCache.putAndAcquire(cacheKey, decoded)
                RenderBitmapDecodeCoordinator.complete(cacheKey, cached)
                return cached
            } catch (e: Throwable) {
                RenderBitmapDecodeCoordinator.fail(cacheKey, e)
                throw e
            }
        }

        deferred.await()

        RenderBitmapMemoryCache.getAndAcquire(cacheKey)?.let { cached ->
            return cached
        }

        val decoded = renderFunc(targetWidth, targetHeight)
        return RenderBitmapMemoryCache.putAndAcquire(cacheKey, decoded)
    }

    private fun requestHybridImage(view: HybridImageView) {
        val generation = nextGeneration(view)
        val targetWidth = view.targetImageWidth()
        val targetHeight = view.targetImageHeight()

        val job = uiScope.launch {
            try {
                loadImage(targetWidth, targetHeight)
                    .then { maybeImage ->
                        val image = maybeImage as? HybridImage ?: return@then

                        uiScope.launch {
                            if (
                                isDisposed ||
                                !isCurrentRequest(view, generation) ||
                                !view.isCurrentImageLoader(this@HybridImageLoader)
                            ) {
                                releaseHybridImageIfRenderOwned(image)
                                removeCompletedJobs(view)
                                return@launch
                            }

                            view.clearRenderBitmap("replace with HybridImage fallback")
                            releaseDisplayedHybridImage(view)

                            view.imageView.setImageBitmap(image.bitmap)

                            if (!allowCaching) {
                                displayedHybridImages[view] = image
                            }

                            removeCompletedJobs(view)
                        }
                    }
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to request HybridImage!", e)
                removeCompletedJobs(view)
            }
        }

        addPendingJob(view, job)
    }

    private fun buildRenderCacheKey(targetWidth: Int, targetHeight: Int): String? {
        val baseKey = renderCacheKey ?: return null
        return "$baseKey@$targetWidth:$targetHeight"
    }

    private fun releaseOrRecycleBitmap(
        bitmap: Bitmap,
        cacheKey: String?,
        reason: String
    ) {
        if (cacheKey != null) {
            RenderBitmapMemoryCache.release(cacheKey)
            return
        }

        recycleBitmap(bitmap, reason)
    }

    private fun addPendingJob(view: HybridImageView, job: Job) {
        val jobs = pendingJobs[view] ?: mutableListOf<Job>().also { pendingJobs[view] = it }
        jobs.add(job)
    }

    private fun removeCompletedJobs(view: HybridImageView) {
        val jobs = pendingJobs[view] ?: return
        jobs.removeAll { job -> job.isCompleted || job.isCancelled }

        if (jobs.isEmpty()) {
            pendingJobs.remove(view)
        }
    }

    private fun nextGeneration(view: HybridImageView): Int {
        val generation = (requestGenerations[view] ?: 0) + 1
        requestGenerations[view] = generation
        return generation
    }

    private fun invalidateRequest(view: HybridImageView) {
        requestGenerations[view] = (requestGenerations[view] ?: 0) + 1
    }

    private fun isCurrentRequest(view: HybridImageView, generation: Int): Boolean {
        return requestGenerations[view] == generation
    }

    private fun releaseDisplayedHybridImage(view: HybridImageView): Boolean {
        val image = displayedHybridImages.remove(view) ?: return false
        releaseHybridImageIfRenderOwned(image)
        return true
    }

    private fun releaseAllDisplayedHybridImages() {
        val images = displayedHybridImages.values.toList()
        displayedHybridImages.clear()

        images.forEach { image ->
            releaseHybridImageIfRenderOwned(image)
        }
    }

    private fun releaseHybridImageIfRenderOwned(image: HybridImage) {
        if (allowCaching) {
            return
        }

        try {
            if (!image.bitmap.isRecycled) {
                                image.dispose()
            }
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to release render-owned HybridImage Bitmap!", e)
        }
    }

    private fun recycleBitmap(bitmap: Bitmap, reason: String) {
        try {
            if (!bitmap.isRecycled) {
                bitmap.recycle()
            }
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to recycle Bitmap! reason=$reason", e)
        }
    }
}
