// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

package com.kaleyra.video_hybrid_native_bridge.configurator

import com.kaleyra.video_hybrid_native_bridge.KaleyraVideoConfiguration

interface CachedSDKConfigurator {

    val lastConfiguration: KaleyraVideoConfiguration?

    fun configureBridge(configuration: KaleyraVideoConfiguration)

    fun reset()
}
