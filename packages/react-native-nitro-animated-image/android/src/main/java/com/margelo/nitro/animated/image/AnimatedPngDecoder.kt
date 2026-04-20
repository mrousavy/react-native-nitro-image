package com.margelo.nitro.animated.image

import coil3.ImageLoader
import coil3.asImage
import coil3.decode.DecodeResult
import coil3.decode.Decoder
import coil3.decode.ImageSource
import coil3.fetch.SourceFetchResult
import coil3.request.Options
import com.github.penfeizhou.animation.apng.APNGDrawable
import com.github.penfeizhou.animation.apng.decode.APNGParser
import com.github.penfeizhou.animation.io.ByteBufferReader
import com.github.penfeizhou.animation.io.StreamReader
import com.github.penfeizhou.animation.loader.Loader
import java.nio.ByteBuffer
import okio.BufferedSource

class AnimatedPngDecoder(private val source: ImageSource) : Decoder {
    override suspend fun decode(): DecodeResult {
        val buffer = source.source().squashToDirectByteBuffer()
        return DecodeResult(
            image = APNGDrawable(Loader { ByteBufferReader(buffer) }).asImage(),
            isSampled = false,
        )
    }

    private fun BufferedSource.squashToDirectByteBuffer(): ByteBuffer {
        request(Long.MAX_VALUE)
        val byteBuffer = ByteBuffer.allocateDirect(buffer.size.toInt())
        while (!buffer.exhausted()) buffer.read(byteBuffer)
        byteBuffer.flip()
        return byteBuffer
    }

    class Factory : Decoder.Factory {
        override fun create(
            result: SourceFetchResult,
            options: Options,
            imageLoader: ImageLoader,
        ): Decoder? {
            val stream = result.source.source().peek().inputStream()
            return if (APNGParser.isAPNG(StreamReader(stream))) {
                AnimatedPngDecoder(result.source)
            } else null
        }
    }
}
