package com.margelo.nitro.image

import android.content.Context
import android.view.View
import android.widget.ImageView

class HybridImageView(context: Context): HybridNitroImageViewSpec() {
    override var image: HybridImageSpec? = null
        set(value) {
            field = value
            updateImage()
        }

    val imageView = ImageView(context)
    override val view: View = imageView

    private fun updateImage() {
        val image = image as? HybridImage ?: return
        imageView.setImageBitmap(image.image)
    }
}