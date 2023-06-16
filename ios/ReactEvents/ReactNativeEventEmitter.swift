// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import Foundation
import React

class ReactNativeEventEmitter: EventEmitter, AccessTokenRequester {

    // MARK: - Properties

    private var emitter: VideoNativeEmitter? {
        VideoNativeEmitter.shared
    }

    // MARK: Event Emission

    func sendEvent(_ event: Events, args: Any?) {
        sendEvent(event.description, args: args)
    }

    private func sendEvent(_ eventName: String, args: Any?) {
        guard let emitter = emitter else { return }
        emitter.sendEvent(withName: eventName, body: args)
    }

    // MARK: - Request Access Token

    func requestAccessToken(request: AccessTokenRequest) throws {
        sendEvent(.accessTokenRequest, args: try request.JSONEncoded())
    }
}
