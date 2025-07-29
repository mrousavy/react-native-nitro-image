package com.margelo.nitro.image

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridImageLoader(private val loadImageFunc: () -> Promise<HybridImageSpec>): HybridImageLoaderSpec() {
    override fun loadImage(): Promise<HybridImageSpec> = loadImageFunc()

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return

        loadImage().then { maybeImage ->
            val image = maybeImage as? HybridImage ?: return@then
            view.imageView.setImageBitmap(image.bitmap)
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return
        view.imageView.setImageDrawable(null)
    }
}