package com.kaleyra.video_react_native_module

import android.content.Context
import com.kaleyra.video_hybrid_native_bridge.ContextContainer
import com.facebook.react.bridge.ReactApplicationContext

class ReactNativeContextContainer(private val reactContext: ReactApplicationContext) : ContextContainer {
    override val context: Context get() = reactContext.currentActivity ?: reactContext.applicationContext
}
