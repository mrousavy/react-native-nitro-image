package com.margelo.nitro.image

import android.util.Size
import androidx.annotation.Keep
import androidx.core.view.doOnLayout
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Keep
@DoNotStrip
class HybridImageLoader(
    private val loadImageFunc: () -> Promise<HybridImageSpec>,
    private val allowCaching: Boolean = true,
    // Optionally loads a smaller Image that still covers the given size, used when displaying it in a view
    private val loadImageForSizeFunc: ((targetSize: Size) -> Promise<HybridImageSpec>)? = null
): HybridImageLoaderSpec() {
    private var cachedResult: HybridImageSpec? = null
    private val uiScope = CoroutineScope(Dispatchers.Main.immediate)

    // The Image loaded for views is only kept alive while at least one view displays it
    private val activeViews = mutableSetOf<HybridImageView>()
    private var viewImage: Promise<HybridImageSpec>? = null
    // The size `viewImage` was loaded for, or `null` if it is full resolution
    private var viewImageSize: Size? = null

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

        // Views are attached before they are laid out, so wait for their size to know how large to load the Image
        view.imageView.doOnLayout {
            // The view might have been dropped before it was laid out
            if (view !in activeViews) return@doOnLayout

            loadImageForView(view).then { maybeImage ->
                val image = maybeImage as? HybridImage ?: return@then
                uiScope.launch {
                    // The view might have been dropped while we were loading
                    if (view in activeViews) {
                        view.imageView.setImageBitmap(image.bitmap)
                    }
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
            viewImageSize = null
        }
        uiScope.launch {
            view.imageView.setImageDrawable(null)
        }
    }

    private fun loadImageForView(view: HybridImageView): Promise<HybridImageSpec> {
        val loadForSize = loadImageForSizeFunc
        val width = view.imageView.width
        val height = view.imageView.height
        // We can only load a smaller Image if we know how to, and the view has a size
        val targetSize = if (loadForSize != null && width > 0 && height > 0) Size(width, height) else null

        val currentImage = viewImage
        if (allowCaching && currentImage != null && covers(viewImageSize, targetSize)) {
            // Share the (possibly still running) load, its Image is already large enough for this view
            return currentImage
        }
        val promise = if (loadForSize != null && targetSize != null) loadForSize(targetSize) else loadImageFunc()
        if (allowCaching) {
            viewImage = promise
            viewImageSize = targetSize
        }
        return promise
    }

    private fun covers(loadedSize: Size?, targetSize: Size?): Boolean {
        // A full resolution Image covers every view, and only a full resolution Image covers a full resolution request
        if (loadedSize == null) return true
        if (targetSize == null) return false
        return loadedSize.width >= targetSize.width && loadedSize.height >= targetSize.height
    }
}
