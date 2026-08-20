package com.margelo.nitro.image

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.margelo.nitro.image.utils.CustomImageView
import com.margelo.nitro.views.RecyclableView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@DoNotStrip
@Keep
class HybridImageView(context: Context): HybridNitroImageViewSpec(), RecyclableView {
    companion object {
        private const val TAG = "HybridImageView"
    }
    private val uiScope = CoroutineScope(Dispatchers.Main.immediate)
    private var resetImageBeforeLoad = false

    val imageView = CustomImageView(context) { visible ->
        if (visible) onAppear()
        else onDisappear()
    }
    override val view: View = imageView

    override var resizeMode: ResizeMode? = ResizeMode.COVER
        set(value) {
            field = value
            uiScope.launch {
                updateResizeMode()
            }
        }

    override var image: Variant_HybridImageSpec_HybridImageLoaderSpec? = null
        set(value) {
            field = value
            uiScope.launch {
                updateImage()
            }
        }

    override var recyclingKey: String? = null
        set(value) {
            resetImageBeforeLoad = field != value
            field = value
        }

    init {
        // A property initializer assigns the backing field directly, so the
        // `resizeMode` setter (which applies the mapping) does not run. And an
        // omitted `resizeMode` prop is never marked dirty, so it is never
        // assigned either - without this, `scaleType` would stay at
        // `ImageView`'s own default (`FIT_CENTER`, i.e. `contain`).
        updateResizeMode()
    }

    override fun prepareForRecycle() {
        onDisappear()
        // Reset all props back to their defaults. Props are only re-applied to a recycled view
        // if they are actually provided by the next consumer, so anything we keep here would
        // silently leak into the next cell.
        image = null
        recyclingKey = null
        resizeMode = ResizeMode.CONTAIN
        resetImageBeforeLoad = false
        imageView.setImageBitmap(null)
        // A recycled view keeps the `scaleType` the previous View set. If the
        // next View omits `resizeMode`, its prop is never dirty and never
        // assigned, so it would silently inherit that mode - reset it here.
        resizeMode = ResizeMode.COVER
    }

    private fun updateResizeMode() {
        imageView.scaleType = when (resizeMode) {
            ResizeMode.COVER -> ImageView.ScaleType.CENTER_CROP
            ResizeMode.CONTAIN -> ImageView.ScaleType.FIT_CENTER
            ResizeMode.STRETCH -> ImageView.ScaleType.FIT_XY
            ResizeMode.CENTER -> ImageView.ScaleType.CENTER
            null -> ImageView.ScaleType.CENTER_CROP
        }
    }

    private fun updateImage() {
        image?.match(
            { actualImage: HybridImageSpec ->
                // Image
                if (actualImage is HybridImage) {
                    imageView.setImageBitmap(actualImage.bitmap)
                } else {
                    throw Error("Image is a different type than HybridImage!")
                }
            },
            { _: HybridImageLoaderSpec ->
                // ImageLoader
                onAppear()
            }
        )
    }

    private fun onAppear() {
        val imageLoader = image?.asSecondOrNull() ?: return
        try {
            if (resetImageBeforeLoad) {
                imageView.setImageDrawable(null)
                resetImageBeforeLoad = false
            }
            imageLoader.requestImage(this)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to request Image!", e)
        }
    }

    private fun onDisappear() {
        val imageLoader = image?.asSecondOrNull() ?: return
        try {
            imageLoader.dropImage(this)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to drop Image!", e)
        }
    }
}
