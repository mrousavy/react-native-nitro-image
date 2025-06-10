package com.margelo.nitro.image

import android.annotation.SuppressLint
import android.graphics.BitmapFactory
import com.margelo.nitro.NitroModules
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

    @SuppressLint("DiscouragedApi")
    override fun loadFromResources(name: String): HybridImageSpec {
        val context = NitroModules.applicationContext ?: throw Error("No context!")
        // Look up ID via it's name
        val rawResourceId: Int = context.resources
            .getIdentifier(name, "raw", context.packageName)
        if (rawResourceId == 0) {
            // It's bundled into the Android resources/assets
            val stream = context.assets.open(name)
            val bitmap = BitmapFactory.decodeStream(stream)
            return HybridImage(bitmap)
        } else {
            // For assets bundled with 'require' instead of linked, they are bundled into `res/raw` in release mode
            val stream = context.resources.openRawResource(rawResourceId)
            val bitmap = BitmapFactory.decodeStream(stream)
            return HybridImage(bitmap)
        }
    }

    override fun loadFromSymbol(symbolName: String): HybridImageSpec {
        throw Error("ImageFactory.loadFromSymbol(symbolName:) is not supported on Android!")
    }
}