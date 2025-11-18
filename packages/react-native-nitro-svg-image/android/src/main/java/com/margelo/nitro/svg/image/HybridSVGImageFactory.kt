package com.margelo.nitro.svg.image

import android.graphics.Bitmap
import android.graphics.Canvas
import com.caverock.androidsvg.SVG
import com.margelo.nitro.image.HybridImage
import com.margelo.nitro.image.HybridImageSpec

class HybridSVGImageFactory : HybridSVGImageFactorySpec() {
    override fun stringToImage(url: String, options: AsyncImageLoadOptions?): HybridImageSpec {
        // Use url as SVG string
        val svgImage = SVG.getFromString(url)
        val width = svgImage.getDocumentWidth().toInt()
        val height = svgImage.getDocumentHeight().toInt()
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        svgImage.renderToCanvas(canvas)
        return HybridImage(bitmap)
    }
}
