package com.margelo.nitro.web.image

import android.content.Context
import android.view.View
import android.widget.ImageView

class HybridImageView(context: Context): HybridNitroImageViewSpec() {
    override var resizeMode: ResizeMode? = ResizeMode.CONTAIN
        set(value) {
            field = value
            imageView.scaleType = when (value) {
                ResizeMode.COVER -> ImageView.ScaleType.CENTER_CROP
                ResizeMode.CONTAIN -> ImageView.ScaleType.FIT_CENTER
                ResizeMode.STRETCH -> ImageView.ScaleType.FIT_XY
                ResizeMode.CENTER -> ImageView.ScaleType.CENTER
                null -> ImageView.ScaleType.FIT_CENTER
            }
            updateImage()
        }

    override var image: HybridImageSpec? = null
        set(value) {
            field = value
            updateImage()
        }

    val imageView = ImageView(context)
    override val view: View = imageView

    private fun updateImage() {
        val image = image as? HybridImage ?: return
        imageView.setImageBitmap(image.bitmap)
    }
}
