package com.margelo.nitro.image

import android.graphics.BitmapFactory
import com.margelo.nitro.core.Promise
import java.net.URL

class HybridImageFactory: HybridImageFactorySpec() {
    override fun loadFromURL(url: String): Promise<HybridImageSpec> {
        return Promise.async {
            val remoteURL = URL(url)
            val stream = remoteURL.openStream()
            val bitmap = BitmapFactory.decodeStream(stream)
            return@async HybridImage(bitmap)
        }
    }
}