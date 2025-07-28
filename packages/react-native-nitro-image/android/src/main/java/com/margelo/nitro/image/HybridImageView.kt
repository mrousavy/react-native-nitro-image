package com.margelo.nitro.image

import android.content.Context
import android.view.View
import android.widget.ImageView
import androidx.appcompat.widget.AppCompatImageView
import androidx.core.view.isVisible

class CustomImageView(context: Context,
                      private val visibilityChanged: (Boolean) -> Unit): AppCompatImageView(context) {
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        visibilityChanged(true)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        visibilityChanged(false)
    }
}

class HybridImageView(context: Context): HybridNitroImageViewSpec() {
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
            updateImage()
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
        imageLoader.requestImage(this)
    }

    private fun onDisappear() {
        val image = image ?: return
        val imageLoader = image.getAs<HybridImageLoaderSpec>() ?: return
        imageLoader.dropImage(this)
    }
}
