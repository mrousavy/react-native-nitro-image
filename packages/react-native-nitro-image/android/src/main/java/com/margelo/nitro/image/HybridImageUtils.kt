package com.margelo.nitro.image

import android.os.Build
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.margelo.nitro.core.ArrayBuffer

@DoNotStrip
@Keep
class HybridImageUtils: HybridImageUtilsSpec() {
    override val supportsHeicLoading: Boolean
        get() {
            // Since Android 10, HEIF/HEIC is standard.
            // https://source.android.com/docs/core/camera/heif
            return Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
        }
    override val supportsHeicWriting: Boolean
        get() {
            // Android does not support saving HEIF data yet
            return false
        }
}
