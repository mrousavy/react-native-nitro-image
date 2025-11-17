package com.margelo.nitro.svg.image

import android.graphics.Bitmap
import android.graphics.Canvas
import com.caverock.androidsvg.SVG
import com.margelo.nitro.core.Promise
import com.margelo.nitro.image.HybridImage
import com.margelo.nitro.image.HybridImageSpec

class HybridSVGImageFactory : HybridSVGImageFactorySpec() {
    override fun renderSVG(svgString: String, width: Double, height: Double): HybridImageSpec {
        val svg = SVG.getFromString(svgString)
        val bitmap = Bitmap.createBitmap(width.toInt(), height.toInt(), Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        svg.renderToCanvas(canvas)
        return HybridImage(bitmap)
    }
}
