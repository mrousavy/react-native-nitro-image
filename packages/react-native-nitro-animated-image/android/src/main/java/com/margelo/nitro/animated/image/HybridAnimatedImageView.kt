package com.margelo.nitro.animated.image

import android.content.Context
import android.graphics.drawable.Animatable
import android.util.Log
import android.view.View
import android.widget.ImageView
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import coil3.ImageLoader
import coil3.load
import com.margelo.nitro.views.RecyclableView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@DoNotStrip
@Keep
class HybridAnimatedImageView(context: Context): HybridNitroAnimatedImageViewSpec(), RecyclableView {
    companion object {
        private const val TAG = "HybridAnimatedImageView"
    }
    private val uiScope = CoroutineScope(Dispatchers.Main.immediate)
    private val imageLoader = ImageLoader.Builder(context)
        .components {
            add(AnimatedPngDecoder.Factory())
        }
        .build()
    private var resetImageBeforeLoad = false

    val imageView = AnimatedImageView(context) { visible ->
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

    override var image: String? = null
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

    override var autoplay: Boolean? = true

    override fun startAnimating() {
        (imageView.drawable as? Animatable)?.start()
    }

    override fun stopAnimating() {
        (imageView.drawable as? Animatable)?.stop()
    }

    override fun prepareForRecycle() {
        onDisappear()
        imageView.setImageDrawable(null)
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
        if (imageView.isAttachedToWindow) {
            loadImage()
        }
    }

    private fun loadImage() {
        val imageUrl = image ?: run {
            imageView.setImageDrawable(null)
            return
        }
        if (resetImageBeforeLoad) {
            imageView.setImageDrawable(null)
            resetImageBeforeLoad = false
        }
        val shouldAutoplay = autoplay ?: true
        imageView.load(imageUrl, imageLoader) {
            if (!shouldAutoplay) {
                listener(onSuccess = { _, _ ->
                    (imageView.drawable as? Animatable)?.stop()
                })
            }
        }
    }

    private fun onAppear() {
        try {
            if (resetImageBeforeLoad) {
                imageView.setImageDrawable(null)
                resetImageBeforeLoad = false
            }
            loadImage()
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to load Image!", e)
        }
    }

    private fun onDisappear() {
        // Coil handles cancellation automatically
    }
}
