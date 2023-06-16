package com.kaleyra.video_react_native_module

import com.kaleyra.video_hybrid_native_bridge.AccessTokenResponse
import com.kaleyra.video_hybrid_native_bridge.VideoHybridBridge
import com.kaleyra.video_hybrid_native_bridge.VideoSDKHybridBridge
import com.facebook.react.bridge.ReactApplicationContext

class ReactNativeVideoHybridBridge private constructor(
  override val contextContainer: ReactNativeContextContainer,
  private val accessTokenProvider: ReactNativeAccessTokenProvider,
  override val eventsEmitter: VideoNativeEmitter
) : VideoHybridBridge by VideoSDKHybridBridge(
  contextContainer = contextContainer,
  tokenProvider = accessTokenProvider,
  eventsEmitter = eventsEmitter
) {

  constructor(
    reactContext: ReactApplicationContext,
    videoNativeEmitter: VideoNativeEmitter
  ) : this(
    ReactNativeContextContainer(reactContext),
    ReactNativeAccessTokenProvider(videoNativeEmitter),
    videoNativeEmitter
  )

  fun setAccessTokenResponse(accessTokenResponse: AccessTokenResponse) {
    accessTokenProvider.setAccessTokenResponse(accessTokenResponse)
  }
}
