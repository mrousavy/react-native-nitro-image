package com.margelo.nitro.animated.image

import android.content.Context
import androidx.appcompat.widget.AppCompatImageView

class AnimatedImageView(context: Context,
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
