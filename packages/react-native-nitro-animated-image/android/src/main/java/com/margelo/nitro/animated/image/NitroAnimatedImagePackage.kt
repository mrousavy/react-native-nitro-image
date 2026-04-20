package com.margelo.nitro.animated.image

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.BaseReactPackage
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.animated.image.views.HybridNitroAnimatedImageViewManager

class NitroAnimatedImagePackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider { HashMap() }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        val viewManagers = ArrayList<ViewManager<*, *>>()
        viewManagers.add(HybridNitroAnimatedImageViewManager())
        return viewManagers
    }

    companion object {
        init {
            NitroAnimatedImageOnLoad.initializeNative()
        }
    }
}
