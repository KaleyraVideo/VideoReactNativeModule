// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

package com.kaleyra.video_react_native_module

import com.kaleyra.video_hybrid_native_bridge.utils.CaseInsensitiveEnumTypeAdapterFactory
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.GsonBuilder
import kotlin.reflect.jvm.javaType
import kotlin.reflect.jvm.kotlinFunction

class VideoNativeModule(
  private val reactContext: ReactApplicationContext,
  private val videoNativeEmitter: VideoNativeEmitter
) : ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "VideoNativeModule"
    internal val gson = GsonBuilder().registerTypeAdapterFactory(
      CaseInsensitiveEnumTypeAdapterFactory()
    ).create()
  }

  private lateinit var reactNativeVideoHybridBridge: ReactNativeVideoHybridBridge

  fun ReactNativeVideoHybridBridge.invoke(
    functionName: String,
    params: String? = null
  ): Boolean {
    this::class.java.methods
      .filter { it.name == functionName }
      .mapNotNull { it.kotlinFunction }
      .maxByOrNull { it.parameters.size }
      ?.let { function ->
        params?.let {
          val arg = gson.fromJson<Any>(params, function.parameters[1].type.javaType)
          function.call(this, arg)
        } ?: function.call(this)
        return true
      }
    return false
  }


  override fun initialize() {
    super.initialize()
    reactNativeVideoHybridBridge = ReactNativeVideoHybridBridge(reactContext, videoNativeEmitter)
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun addListener(type: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun configure(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::configureBridge.name, payload)

  @ReactMethod
  fun connect(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::connect.name, payload)

  @ReactMethod
  fun setAccessTokenResponse(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::setAccessTokenResponse.name, payload)

  @ReactMethod
  private fun disconnect() = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::disconnect.name)

  @ReactMethod
  fun reset() = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::reset.name)

  @ReactMethod
  private fun clearUserCache() = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::clearUserCache.name)

  @ReactMethod
  fun handlePushNotificationPayload(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::handlePushNotificationPayload.name, payload)

  @ReactMethod
  fun verifyCurrentCall(payload: Boolean) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::verifyCurrentCall.name, payload.toString())

  @ReactMethod
  fun setDisplayModeForCurrentCall(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::setDisplayModeForCurrentCall.name, payload)

  @ReactMethod
  fun startCall(payload: String)= reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::startCall.name, payload)

  @ReactMethod
  fun startCallUrl(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::startCallUrl.name, payload)

  @ReactMethod
  fun startChat(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::startChat.name, payload)

  @ReactMethod
  fun addUsersDetails(payload: String) = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::addUsersDetails.name, payload)

  @ReactMethod
  fun removeUsersDetails() = reactNativeVideoHybridBridge.invoke(reactNativeVideoHybridBridge::removeUserDetails.name)

}
