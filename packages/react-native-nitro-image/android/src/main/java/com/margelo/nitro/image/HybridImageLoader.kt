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
    private val uiScope = CoroutineScope(Dispatchers.Main.immediate)

    // The Image loaded for views is only kept alive while at least one view displays it
    private val activeViews = mutableSetOf<HybridImageView>()
    private var viewImage: Promise<HybridImageSpec>? = null

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
        activeViews.add(view)

        loadImageForViews().then { maybeImage ->
            val image = maybeImage as? HybridImage ?: return@then
            uiScope.launch {
                // The view might have been dropped while we were loading
                if (view in activeViews) {
                    view.imageView.setImageBitmap(image.bitmap)
                }
            }
        }
    }

    override fun dropImage(forView: HybridNitroImageViewSpec) {
        val view = forView as? HybridImageView ?: return
        activeViews.remove(view)
        if (activeViews.isEmpty()) {
            // No view displays the Image anymore - release it
            viewImage = null
        }
        uiScope.launch {
            view.imageView.setImageDrawable(null)
        }
    }

    private fun loadImageForViews(): Promise<HybridImageSpec> {
        if (!allowCaching) {
            return loadImageFunc()
        }
        // Share one (possibly still running) load between all views that display this Image
        return viewImage ?: loadImageFunc().also { promise ->
            viewImage = promise
        }
    }
}
