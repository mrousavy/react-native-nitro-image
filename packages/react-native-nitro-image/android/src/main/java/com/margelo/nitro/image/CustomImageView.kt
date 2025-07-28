package com.margelo.nitro.image

import android.content.Context
import androidx.appcompat.widget.AppCompatImageView

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
