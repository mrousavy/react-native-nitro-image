package com.margelo.nitro.image

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.annotation.Keep
import androidx.core.view.isVisible
import com.facebook.common.internal.DoNotStrip
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@DoNotStrip
@Keep
class HybridImageView(context: Context): HybridNitroImageViewSpec() {
    companion object {
        private const val TAG = "HybridImageView"
    }
    private val uiScope = CoroutineScope(Dispatchers.Main)
    private var resetImageBeforeLoad = false

    val imageView = CustomImageView(context) { visible ->
        if (visible) onAppear()
        else onDisappear()
    }
    override val view: View = imageView

    override var resizeMode: ResizeMode? = ResizeMode.CONTAIN
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
        val image = image ?: return
        if (image.isFirst) {
            val actualImage = image.getAs<HybridImageSpec>() ?: throw Error("Types got messed up!")
            if (actualImage is HybridImage) {
                imageView.setImageBitmap(actualImage.bitmap)
            } else {
                throw Error("Image is a different type than HybridImage!")
            }
        } else if (image.isSecond) {
            if (imageView.isVisible) {
                onAppear()
            }
        } else {
            throw Error("Image is neither an Image nor an ImageLoader!")
        }
    }

    private fun onAppear() {
        val image = image ?: return
        val imageLoader = image.getAs<HybridImageLoaderSpec>() ?: return
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
        val image = image ?: return
        val imageLoader = image.getAs<HybridImageLoaderSpec>() ?: return
        try {
            imageLoader.dropImage(this)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to drop Image!", e)
        }
    }
}
