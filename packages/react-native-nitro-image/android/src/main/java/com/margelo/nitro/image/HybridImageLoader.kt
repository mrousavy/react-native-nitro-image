package com.margelo.nitro.image

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Keep
@DoNotStrip
class HybridImageLoader(
    private val loadImageFunc: () -> Promise<HybridImageSpec>,
    private val allowCaching: Boolean = true
): HybridImageLoaderSpec() {
    private var cachedResult: HybridImageSpec? = null
    private val uiScope = CoroutineScope(Dispatchers.Main)

    override fun loadImage(): Promise<HybridImageSpec> {
        if (allowCaching) {
            // We can cache the last loaded image in state, so future requests receive it instantly
            cachedResult?.let { cachedResult ->
                return Promise.resolved(cachedResult)
            }
            return loadImageFunc()
                .then { image ->
                    this.cachedResult = image
                }
        } else {
            return loadImageFunc()
        }
    }

    override fun requestImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return

        loadImage().then { maybeImage ->
            val image = maybeImage as? HybridImage ?: return@then
            uiScope.launch {
                view.imageView.setImageBitmap(image.bitmap)
            }
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return
        uiScope.launch {
            view.imageView.setImageDrawable(null)
        }
    }
}
