package com.margelo.nitro.image

import android.media.Image
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@Suppress("ConvertSecondaryConstructorToPrimary")
@Keep
@DoNotStrip
class HybridImage: HybridImageSpec {
    val image: Image

    override val width: Double
        get() = image.width.toDouble()
    override val height: Double
        get() = image.height.toDouble()

    constructor(image: Image) {
        this.image = image
    }
}
