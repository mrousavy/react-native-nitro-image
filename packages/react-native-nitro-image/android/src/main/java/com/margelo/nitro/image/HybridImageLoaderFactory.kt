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
        return HybridImageLoader(
            { factory.loadFromFileAsync(filePath) },
            true,
            { targetSize -> factory.loadFromFileAsync(filePath, targetSize) }
        )
    }

    override fun createResourceImageLoader(name: String): HybridImageLoaderSpec {
        return HybridImageLoader(
            { factory.loadFromResourcesAsync(name) },
            true,
            { targetSize -> factory.loadFromResourcesAsync(name, targetSize) }
        )
    }

    override fun createSymbolImageLoader(symbolName: String): HybridImageLoaderSpec {
        return HybridImageLoader({ Promise.resolved(factory.loadFromSymbol(symbolName)) }, true)
    }

    override fun createRawPixelDataImageLoader(data: RawPixelData): HybridImageLoaderSpec {
        return HybridImageLoader({ factory.loadFromRawPixelDataAsync(data, false) }, true)
    }

    override fun createEncodedImageDataImageLoader(data: EncodedImageData): HybridImageLoaderSpec {
        return HybridImageLoader(
            { factory.loadFromEncodedImageDataAsync(data) },
            true,
            { targetSize -> factory.loadFromEncodedImageDataAsync(data, targetSize) }
        )
    }
}
