package com.margelo.nitro.web.image

import coil3.annotation.ExperimentalCoilApi
import coil3.decode.BlackholeDecoder
import coil3.request.CachePolicy
import coil3.request.ImageRequest
import coil3.size.Precision

@OptIn(ExperimentalCoilApi::class)
fun ImageRequest.Builder.applyOptions(options: AsyncImageLoadOptions?): ImageRequest.Builder {
    if (options == null) return this
    var result = this

    if (options.priority != null) {
        options.priority.toCoroutineContext()?.let { context ->
            result = result.coroutineContext(context)
        }
    }

    if (options.forceRefresh == true) {
        // don't allow reading from cache, only writing.
        result = result.diskCachePolicy(CachePolicy.WRITE_ONLY)
        result = result.memoryCachePolicy(CachePolicy.WRITE_ONLY)
        result = result.networkCachePolicy(CachePolicy.WRITE_ONLY)
    }

    if (options.continueInBackground == true) {
        // TODO: Implement .continueInBackground
    }

    if (options.allowInvalidSSLCertificates == true) {
        // TODO: Implement .allowInvalidSSLCertificates
    }

    if (options.scaleDownLargeImages == true) {
        // Limit to 4096x4096 (~60 MB)
        result = result.size(4096, 4096)
        result = result.precision(Precision.INEXACT)
    }

    if (options.queryMemoryDataSync == true) {
        // TODO: Implement .queryMemoryDataSync
    }

    if (options.queryDiskDataSync == true) {
        // TODO: Implement .queryDiskDataSync
    }

    if (options.decodeImage == false) {
        result = result.decoderFactory(BlackholeDecoder.Factory())
    }

    return result
}
