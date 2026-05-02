package com.margelo.nitro.image

import android.content.Context
import android.graphics.Bitmap
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
import kotlin.math.max
import kotlin.math.min

@DoNotStrip
@Keep
class HybridImageView(context: Context) : HybridNitroImageViewSpec(), RecyclableView {
    companion object {
        private const val TAG = "HybridImageView"

        private const val DEFAULT_RENDER_TARGET_SIZE = 512
        private const val MAX_FALLBACK_RENDER_TARGET_SIZE = 768
    }

    private val uiScope = CoroutineScope(Dispatchers.Main.immediate)

    private var resetImageBeforeLoad = false
    private var currentRenderBitmap: Bitmap? = null
    private var currentRenderOwner: HybridImageLoaderSpec? = null
    private var currentRenderCacheKey: String? = null

    val imageView = CustomImageView(context) { visible ->
        if (visible) {
            onAppear()
        } else {
            onDisappear()
        }
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
            val oldLoader = field?.asSecondOrNull()
            val newLoader = value?.asSecondOrNull()

            if (oldLoader != null && oldLoader !== newLoader) {
                try {
                    oldLoader.dropImage(this)
                } catch (e: Throwable) {
                    Log.e(TAG, "Failed to drop previous ImageLoader!", e)
                }
            }

            if (oldLoader !== newLoader) {
                clearRenderBitmap("image prop changed")
            }

            field = value

            uiScope.launch {
                updateImage()
            }
        }

    override var recyclingKey: String? = null
        set(value) {
            val changed = field != value
            field = value

            
            if (!changed) {
                return
            }

            resetImageBeforeLoad = true

            val imageLoader = image?.asSecondOrNull()
            if (imageLoader != null) {
                try {
                    imageLoader.dropImage(this)
                } catch (e: Throwable) {
                    Log.e(TAG, "Failed to drop ImageLoader after recyclingKey change!", e)
                }
            }

            clearRenderBitmap("recyclingKey changed")
        }

    override fun prepareForRecycle() {
        onDisappear()
        resetImageBeforeLoad = true
        clearRenderBitmap("prepareForRecycle")
    }

    internal fun isCurrentImageLoader(loader: HybridImageLoaderSpec): Boolean {
        return image?.asSecondOrNull() === loader
    }

    internal fun targetImageWidth(): Int {
        val width = imageView.width
        if (width > 0) {
            return width
        }

        val measuredWidth = imageView.measuredWidth
        if (measuredWidth > 0) {
            return measuredWidth
        }

        val layoutWidth = imageView.layoutParams?.width ?: 0
        if (layoutWidth > 0) {
            return layoutWidth
        }

        return fallbackTargetSize()
    }

    internal fun targetImageHeight(): Int {
        val height = imageView.height
        if (height > 0) {
            return height
        }

        val measuredHeight = imageView.measuredHeight
        if (measuredHeight > 0) {
            return measuredHeight
        }

        val layoutHeight = imageView.layoutParams?.height ?: 0
        if (layoutHeight > 0) {
            return layoutHeight
        }

        return fallbackTargetSize()
    }

    internal fun setRenderBitmap(
        owner: HybridImageLoaderSpec,
        bitmap: Bitmap,
        cacheKey: String?
    ) {
        
        if (!isCurrentImageLoader(owner)) {
            releaseOrRecycleBitmap(
                bitmap = bitmap,
                cacheKey = cacheKey,
                reason = "setRenderBitmap stale owner"
            )
            return
        }

        clearRenderBitmap("replace render bitmap")

        currentRenderOwner = owner
        currentRenderBitmap = bitmap
        currentRenderCacheKey = cacheKey

        imageView.setImageBitmap(bitmap)
    }

    internal fun clearRenderBitmap(reason: String): Boolean {
        val bitmap = currentRenderBitmap
        val cacheKey = currentRenderCacheKey
        val hadBitmap = bitmap != null

        currentRenderBitmap = null
        currentRenderOwner = null
        currentRenderCacheKey = null

        if (hadBitmap) {
            imageView.setImageDrawable(null)
        }

        if (bitmap != null) {
            releaseOrRecycleBitmap(bitmap, cacheKey, reason)
        }

        return hadBitmap
    }

    internal fun clearRenderBitmapForOwner(
        owner: HybridImageLoaderSpec,
        reason: String
    ): Boolean {
        if (currentRenderOwner !== owner) {
            return false
        }

        return clearRenderBitmap(reason)
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
        val currentImage = image

        if (currentImage == null) {
            clearRenderBitmap("image set to null")
            imageView.setImageDrawable(null)
            return
        }

        currentImage.match(
            { actualImage: HybridImageSpec ->
                clearRenderBitmap("switch to direct HybridImage")

                val hybridImage = actualImage as? HybridImage
                    ?: throw Error("Image is a different type than HybridImage!")

                imageView.setImageBitmap(hybridImage.bitmap)
            },
            { _: HybridImageLoaderSpec ->
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
        val imageLoader = image?.asSecondOrNull()

        if (imageLoader != null) {
            try {
                imageLoader.dropImage(this)
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to drop Image!", e)
            }
        }

        clearRenderBitmap("onDisappear")
    }

    private fun releaseOrRecycleBitmap(
        bitmap: Bitmap,
        cacheKey: String?,
        reason: String
    ) {
        if (cacheKey != null) {
                        RenderBitmapMemoryCache.release(cacheKey)
            return
        }

        recycleBitmap(bitmap, reason)
    }

    private fun recycleBitmap(bitmap: Bitmap, reason: String) {
        try {
            if (!bitmap.isRecycled) {
                                bitmap.recycle()
            }
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to recycle view-owned Bitmap! reason=$reason", e)
        }
    }

    private fun fallbackTargetSize(): Int {
        val displayMetrics = imageView.resources.displayMetrics
        val screenMax = max(displayMetrics.widthPixels, displayMetrics.heightPixels)

        if (screenMax <= 0) {
            return DEFAULT_RENDER_TARGET_SIZE
        }

        return min(screenMax, MAX_FALLBACK_RENDER_TARGET_SIZE)
            .coerceAtLeast(DEFAULT_RENDER_TARGET_SIZE)
    }
}
