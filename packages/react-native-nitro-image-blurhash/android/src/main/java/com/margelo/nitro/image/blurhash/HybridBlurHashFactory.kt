package com.margelo.nitro.image.blurhash

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImage
import com.margelo.nitro.image.HybridImageSpec
import com.margelo.nitro.image.extensions.toCpuAccessible
import com.mrousavy.blurhash.BlurHashDecoder
import com.mrousavy.blurhash.BlurHashEncoder

@DoNotStrip
@Keep
class HybridBlurHashFactory : HybridBlurHashFactorySpec() {
    override fun encode(image: HybridImageSpec, componentsX: Double, componentsY: Double): String {
        val native = image as? HybridImage
            ?: throw Error("The given image ($image) is not a `HybridImage` and cannot be encoded to a BlurHash!")
        return BlurHashEncoder.encode(native.bitmap.toCpuAccessible(), componentsX.toInt(), componentsY.toInt())
    }

    override fun encodeAsync(image: HybridImageSpec, componentsX: Double, componentsY: Double): Promise<String> {
        return Promise.async { encode(image, componentsX, componentsY) }
    }

    override fun decode(blurhash: String, width: Double, height: Double, punch: Double): HybridImageSpec {
        val bitmap = BlurHashDecoder.decode(blurhash, width.toInt(), height.toInt(), punch.toFloat())
            ?: throw Error("The given BlurHash ($blurhash) is not a valid BlurHash!")
        return HybridImage(bitmap)
    }

    override fun decodeAsync(blurhash: String, width: Double, height: Double, punch: Double): Promise<HybridImageSpec> {
        return Promise.async { decode(blurhash, width, height, punch) }
    }

    override fun clearCosineCache() {
        BlurHashDecoder.clearCache()
    }
}
