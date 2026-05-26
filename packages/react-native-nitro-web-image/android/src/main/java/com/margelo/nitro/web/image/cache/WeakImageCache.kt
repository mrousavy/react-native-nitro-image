package com.margelo.nitro.web.image.cache

import coil3.Image
import coil3.memory.MemoryCache.Key
import coil3.memory.MemoryCache.Value
import java.lang.ref.WeakReference

/**
 * Holds weak references to images that have been evicted from the strong cache.
 *
 * A port of coil3.memory.RealWeakMemoryCache:
 * https://github.com/coil-kt/coil/blob/3.3.0/coil-core/src/commonMain/kotlin/coil3/memory/WeakMemoryCache.kt
 */
internal class WeakImageCache {

    internal val cache = LinkedHashMap<Key, ArrayList<InternalValue>>()
    private var operationsSinceCleanUp = 0

    val keys: Set<Key>
        get() = cache.keys.toSet()

    fun get(key: Key): Value? {
        val values = cache[key] ?: return null

        // Find the first image that hasn't been collected.
        var value: Value? = null
        for (index in values.indices) {
            val image = values[index].image.get()
            if (image != null) {
                value = Value(image, values[index].extras)
                break
            }
        }

        cleanUpIfNecessary()
        return value
    }

    fun set(key: Key, image: Image, extras: Map<String, Any>, size: Long) {
        val values = cache.getOrPut(key) { arrayListOf() }

        // Insert the value into the list sorted descending by size.
        val newValue = InternalValue(WeakReference(image), extras, size)
        if (values.isEmpty()) {
            values += newValue
        } else {
            for (index in values.indices) {
                val value = values[index]
                if (size >= value.size) {
                    if (value.image.get() === image) {
                        values[index] = newValue
                    } else {
                        values.add(index, newValue)
                    }
                    break
                }
            }
        }

        cleanUpIfNecessary()
    }

    fun remove(key: Key): Boolean {
        return cache.remove(key) != null
    }

    fun clear() {
        operationsSinceCleanUp = 0
        cache.clear()
    }

    private fun cleanUpIfNecessary() {
        if (operationsSinceCleanUp++ >= CLEAN_UP_INTERVAL) {
            cleanUp()
        }
    }

    /** Remove any dereferenced images from the cache. */
    internal fun cleanUp() {
        operationsSinceCleanUp = 0

        // Remove all the values whose references have been collected.
        val iterator = cache.values.iterator()
        while (iterator.hasNext()) {
            val list = iterator.next()

            if (list.size <= 1) {
                // Typically, the list will only contain 1 item. Handle this case in an optimal way here.
                if (list.firstOrNull()?.image?.get() == null) {
                    iterator.remove()
                }
            } else {
                // Iterate over the list of values and delete individual entries that have been collected.
                var writeIndex = 0
                for (readIndex in list.indices) {
                    if (list[readIndex].image.get() != null) {
                        list[writeIndex] = list[readIndex]
                        writeIndex++
                    }
                }
                while (list.size > writeIndex) list.removeAt(list.size - 1)

                if (list.isEmpty()) {
                    iterator.remove()
                }
            }
        }
    }

    internal class InternalValue(
        val image: WeakReference<Image>,
        val extras: Map<String, Any>,
        val size: Long,
    )

    companion object {
        private const val CLEAN_UP_INTERVAL = 10
    }
}
