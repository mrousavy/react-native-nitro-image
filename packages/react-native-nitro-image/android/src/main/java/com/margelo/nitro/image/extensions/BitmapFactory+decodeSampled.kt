package com.margelo.nitro.image.extensions

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Size

/**
 * Decodes an encoded image (JPEG, PNG, ...) through [decode], subsampled so it is no larger
 * than needed to fill [targetSize]. If [targetSize] is `null`, it is decoded in full resolution.
 * [decode] may be called twice, so it must open a fresh stream each time.
 */
inline fun decodeSampledBitmap(targetSize: Size?, decode: (BitmapFactory.Options) -> Bitmap?): Bitmap? {
    if (targetSize == null) {
        return decode(BitmapFactory.Options())
    }
    // 1. Only read the image's dimensions
    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    decode(bounds)
    // 2. Find the largest power-of-two sample size that still covers the target size
    var sampleSize = 1
    while (bounds.outWidth / (sampleSize * 2) >= targetSize.width &&
        bounds.outHeight / (sampleSize * 2) >= targetSize.height) {
        sampleSize *= 2
    }
    // 3. Decode the subsampled image
    return decode(BitmapFactory.Options().apply { inSampleSize = sampleSize })
}
