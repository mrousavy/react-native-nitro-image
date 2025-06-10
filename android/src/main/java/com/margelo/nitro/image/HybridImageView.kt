package com.margelo.nitro.image

import android.content.Context
import android.view.View
import android.widget.ImageView

class HybridImageView(context: Context): HybridNitroImageViewSpec() {
    override var image: HybridImageSpec? = null

    val imageView = ImageView(context)
    override val view: View = imageView
}