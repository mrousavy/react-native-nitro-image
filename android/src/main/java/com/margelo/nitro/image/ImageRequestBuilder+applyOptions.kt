package com.margelo.nitro.image

import coil3.annotation.ExperimentalCoilApi
import coil3.decode.BlackholeDecoder
import coil3.request.CachePolicy
import coil3.request.ImageRequest
import coil3.size.Precision

@OptIn(ExperimentalCoilApi::class)
suspend fun ImageRequest.Builder.applyOptions(options: AsyncImageLoadOptions?): ImageRequest.Builder {
    if (options == null) return this
    var result = this

    if (options.priority != null) {
        result.coroutineContext(options.priority.toCoroutineContext())
    }

    if (options.forceRefresh == true) {
        // don't allow reading from cache, only writing.
        result.diskCachePolicy(CachePolicy.WRITE_ONLY)
            .memoryCachePolicy(CachePolicy.WRITE_ONLY)
            .networkCachePolicy(CachePolicy.WRITE_ONLY)
    }

    if (options.continueInBackground == true) {
        // TODO: Implement .continueInBackground
    }

    if (options.allowInvalidSSLCertificates == true) {
        // TODO: Implement .allowInvalidSSLCertificates
    }

    if (options.scaleDownLargeImages == true) {
        // Limit to 4096x4096 (~60 MB)
        result.size(4096, 4096)
            .precision(Precision.INEXACT)
    }

    if (options.queryMemoryDataSync == true) {
        // TODO: Implement .queryMemoryDataSync
    }

    if (options.queryDiskDataSync == true) {
        // TODO: Implement .queryDiskDataSync
    }

    if (options.decodeImage == false) {
        result.decoderFactory(BlackholeDecoder.Factory())
    }

    if (options.cacheKey != null) {
        result.diskCacheKey(options.cacheKey)
    }
    return result
}