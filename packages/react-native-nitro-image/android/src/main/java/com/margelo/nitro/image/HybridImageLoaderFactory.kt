package com.margelo.nitro.image

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridImageLoaderFactory: HybridImageLoaderFactorySpec() {
    private val factory = HybridImageFactory()

    override fun createFileImageLoader(filePath: String): HybridImageLoaderSpec {
        return HybridImageLoader { factory.loadFromFileAsync(filePath) }
    }

    override fun createResourceImageLoader(name: String): HybridImageLoaderSpec {
        return HybridImageLoader { factory.loadFromResourcesAsync(name) }
    }

    override fun createSymbolImageLoader(symbolName: String): HybridImageLoaderSpec {
        return HybridImageLoader { Promise.resolved(factory.loadFromSymbol(symbolName)) }
    }

    override fun createArrayBufferImageLoader(buffer: ArrayBuffer): HybridImageLoaderSpec {
        return HybridImageLoader { factory.loadFromArrayBufferAsync(buffer) }
    }
}
