package com.margelo.nitro.image

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridImageLoaderFactory : HybridImageLoaderFactorySpec() {
    private val factory = HybridImageFactory()

    override fun createFileImageLoader(filePath: String): HybridImageLoaderSpec {
        return HybridImageLoader(
            loadImageFunc = { targetWidth, targetHeight ->
                factory.loadFromFileAsync(filePath, targetWidth, targetHeight)
            },
            allowCaching = false,
            renderCacheKey = filePath,
            renderBitmapFunc = { targetWidth, targetHeight ->
                factory.decodeBitmapFromFile(filePath, targetWidth, targetHeight)
            }
        )
    }

    override fun createResourceImageLoader(name: String): HybridImageLoaderSpec {
        return HybridImageLoader(
            loadImageFunc = { _, _ ->
                factory.loadFromResourcesAsync(name)
            },
            allowCaching = true
        )
    }

    override fun createSymbolImageLoader(symbolName: String): HybridImageLoaderSpec {
        return HybridImageLoader(
            loadImageFunc = { _, _ ->
                Promise.resolved(factory.loadFromSymbol(symbolName))
            },
            allowCaching = true
        )
    }

    override fun createRawPixelDataImageLoader(data: RawPixelData): HybridImageLoaderSpec {
        return HybridImageLoader(
            loadImageFunc = { _, _ ->
                factory.loadFromRawPixelDataAsync(data, false)
            },
            allowCaching = false
        )
    }

    override fun createEncodedImageDataImageLoader(data: EncodedImageData): HybridImageLoaderSpec {
        return HybridImageLoader(
            loadImageFunc = { _, _ ->
                factory.loadFromEncodedImageDataAsync(data)
            },
            allowCaching = false
        )
    }
}