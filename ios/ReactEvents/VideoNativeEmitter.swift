// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import Foundation
import React

@objc(VideoNativeEmitter)
class VideoNativeEmitter: RCTEventEmitter {

    public static var shared: VideoNativeEmitter?

    private var hasListeners = false

    // MARK: - Init

    override init() {
        super.init()
        VideoNativeEmitter.shared = self
    }

    // MARK: - RCTEventEmitter

    @objc(supportedEvents)
    override func supportedEvents() -> [String]! {
        var supportedEvents = Events.allCases.map({ $0.description })
        supportedEvents.append("accessTokenRequest")
        return supportedEvents
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    override func sendEvent(withName name: String!, body: Any!) {
        guard hasListeners else { return }
        super.sendEvent(withName: name, body: body)
    }
}
