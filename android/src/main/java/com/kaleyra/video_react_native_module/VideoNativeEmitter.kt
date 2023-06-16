package com.kaleyra.video_react_native_module

import com.kaleyra.video_hybrid_native_bridge.events.Events
import com.kaleyra.video_hybrid_native_bridge.events.EventsEmitter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class VideoNativeEmitter(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext), EventsEmitter {

  companion object {
    private const val NAME = "VideoNativeEmitter"
  }

  override fun getName(): String = NAME

  private var channel: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

  override fun initialize() {
    super.initialize()
    channel = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
  }

  @ReactMethod
  fun addListener(type: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  override fun sendEvent(event: Events, args: Any?) {
    channel?.emit(event.value, VideoNativeModule.gson.toJson(args))
  }

  fun sendAccessTokenRequest(args: Any?) {
    channel?.emit(Events.AccessTokenRequest.value, VideoNativeModule.gson.toJson(args))
  }

}
