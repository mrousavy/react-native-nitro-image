package com.margelo.nitro.image

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.core.view.isVisible

class HybridImageView(context: Context): HybridNitroImageViewSpec() {
    companion object {
        private const val TAG = "HybridImageView"
    }
    override var resizeMode: ResizeMode? = ResizeMode.CONTAIN
        set(value) {
            field = value
            imageView.scaleType = when (value) {
                ResizeMode.COVER -> ImageView.ScaleType.CENTER_CROP
                ResizeMode.CONTAIN -> ImageView.ScaleType.FIT_CENTER
                ResizeMode.STRETCH -> ImageView.ScaleType.FIT_XY
                ResizeMode.CENTER -> ImageView.ScaleType.CENTER
                null -> ImageView.ScaleType.CENTER_CROP
            }
        }

    override var image: Variant_HybridImageSpec_HybridImageLoaderSpec? = null
        set(value) {
            field = value
            updateImage()
        }

    val imageView = CustomImageView(context) { visible ->
        if (visible) onAppear()
        else onDisappear()
    }
    override val view: View = imageView

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
