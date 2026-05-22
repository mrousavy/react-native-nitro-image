package com.margelo.nitro.web.image.cache

import coil3.Image
import coil3.memory.MemoryCache
import coil3.memory.MemoryCache.Key
import kotlinx.atomicfu.locks.SynchronizedObject
import kotlinx.atomicfu.locks.synchronized

const val CACHE_PRIORITY_EXTRA = "cachePriority"
private const val BUCKET_COUNT = 3
private const val DEFAULT_PRIORITY = 1


class PriorityMemoryCache(
    initialMaxSize: Long,
) : MemoryCache {

    private val lock = SynchronizedObject()
    // `true` auto-moves the entry to the MRU tail.
    private val buckets = Array(BUCKET_COUNT) { LinkedHashMap<Key, InternalValue>(16, 0.75f, true) }
    private val keyToBucket = HashMap<Key, Int>()
    private var currentBytes = 0L
    // Weak tier mirrors Coil's WeakMemoryCache. Catches images that are evicted
    // from the strong tier but still strong-referenced by an in-flight consumer.
    private val weakCache = WeakImageCache()

    override val initialMaxSize: Long = initialMaxSize

    override val size: Long
        get() = synchronized(lock) {
            currentBytes
        }

    override var maxSize: Long = initialMaxSize
        get() = synchronized(lock) {
            field
        }
        set(value) = synchronized(lock) {
            field = value
            trimToSize(value)
        }

    override val keys: Set<Key>
        get() = synchronized(lock) {
            HashSet(keyToBucket.keys) + weakCache.keys
        }

    override fun get(key: Key): MemoryCache.Value? = synchronized(lock) {
        val bucketIndex = keyToBucket[key]
        if (bucketIndex == null) {
            // Strong miss, fall back to the weak tier (mirrors RealMemoryCache.get from Coil).
            val weakHit = weakCache.get(key) ?: return null
            if (!weakHit.image.shareable) weakCache.remove(key)
            return weakHit
        }
        val cachedEntry = buckets[bucketIndex][key] ?: return null

        // Unshareable images (e.g. animated GIFs) can't be safely held by two
        // consumers at once, so hand the entry out and drop it from both tiers.
        if (!cachedEntry.image.shareable) {
            keyToBucket.remove(key)
            buckets[bucketIndex].remove(key)
            currentBytes -= cachedEntry.size
            weakCache.remove(key)
        }
        return MemoryCache.Value(cachedEntry.image, cachedEntry.extras)
    }

    override fun set(key: Key, value: MemoryCache.Value) = synchronized(lock) {
        val entryBytes = value.image.size
        check(entryBytes >= 0) { "Image size must be non-negative: $entryBytes" }

        // Replace any prior entry under this key; forward the displaced image to weak
        evictFromStrongToWeak(key)

        // Refuse oversized entries would otherwise evict the rest of the cache.
        // Coil's RealStrongMemoryCache.set still hands oversized values to weak.
        if (entryBytes > maxSize) {
            weakCache.set(key, value.image, value.extras, entryBytes)
            return@synchronized
        }

        val priority = parsePriority(key)
        buckets[priority][key] = InternalValue(value.image, value.extras, entryBytes)
        keyToBucket[key] = priority
        currentBytes += entryBytes

        trimToSize(maxSize)
    }

    override fun remove(key: Key): Boolean = synchronized(lock) {
        val removedStrong = removeFromStrong(key)
        val removedWeak = weakCache.remove(key)
        return removedStrong || removedWeak
    }

    override fun trimToSize(size: Long) = synchronized(lock) {
        while (currentBytes > size) {
            if (!evictOne()) return@synchronized
        }
    }

    override fun clear() = synchronized(lock) {
        for (bucket in buckets) bucket.clear()
        keyToBucket.clear()
        currentBytes = 0L
        weakCache.clear()
    }

    private fun evictOne(): Boolean {
        for (priority in 0 until BUCKET_COUNT) {
            val bucket = buckets[priority]
            if (bucket.isEmpty()) continue
            // Head of an access-order LinkedHashMap = least-recently-used entry.
            val oldestKey = bucket.entries.iterator().next().key
            evictFromStrongToWeak(oldestKey)
            return true
        }
        return false
    }

    /** Pull an entry out of the strong tier and hand it to the weak tier. */
    private fun evictFromStrongToWeak(key: Key) {
        val bucketIndex = keyToBucket.remove(key) ?: return
        val displaced = buckets[bucketIndex].remove(key) ?: return
        currentBytes -= displaced.size
        weakCache.set(key, displaced.image, displaced.extras, displaced.size)
    }

    /** Strong-tier-only removal. Caller is responsible for the weak tier. */
    private fun removeFromStrong(key: Key): Boolean {
        val bucketIndex = keyToBucket.remove(key) ?: return false
        val value = buckets[bucketIndex].remove(key) ?: return false
        currentBytes -= value.size
        return true
    }

    private fun parsePriority(key: Key): Int {
        val rawPriority = key.extras[CACHE_PRIORITY_EXTRA]?.toIntOrNull() ?: DEFAULT_PRIORITY
        // Clamp out-of-range priorities to a valid bucket index.
        return rawPriority.coerceIn(0, BUCKET_COUNT - 1)
    }

    private class InternalValue(
        val image: Image,
        val extras: Map<String, Any>,
        val size: Long,
    )
}
