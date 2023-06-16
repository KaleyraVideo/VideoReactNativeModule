package com.kaleyra.video_react_native_module

import com.kaleyra.video_hybrid_native_bridge.AccessTokenRequest
import com.kaleyra.video_hybrid_native_bridge.AccessTokenResponse
import com.kaleyra.video_hybrid_native_bridge.CrossPlatformAccessTokenProvider
import java.util.UUID

class ReactNativeAccessTokenProvider(private val videoNativeEmitter: VideoNativeEmitter) : CrossPlatformAccessTokenProvider {

  private var tokenCompletion: ((Result<String>) -> Unit)? = null

  override fun provideAccessToken(userId: String, completion: (Result<String>) -> Unit) {
    videoNativeEmitter.sendAccessTokenRequest(AccessTokenRequest(UUID.randomUUID().toString(), userId))
    tokenCompletion = completion
  }

  fun setAccessTokenResponse(accessTokenResponse: AccessTokenResponse) {
    val tokenCompletion = tokenCompletion ?: return
    if (accessTokenResponse.success) tokenCompletion(Result.success(accessTokenResponse.data))
    else tokenCompletion(Result.failure(Throwable(accessTokenResponse.error ?: "error")))
  }
}
