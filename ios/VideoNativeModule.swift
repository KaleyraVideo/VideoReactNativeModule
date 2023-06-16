// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import Foundation
import Bandyer
import React

@available(iOS 12.0, *)
@objc(VideoNativeModule)
class VideoNativeModule: NSObject {

    // MARK: - Properties

    private let eventEmitter = ReactNativeEventEmitter()
    private let tokenProvider: TokenProvider

    private let bridge: VideoHybridNativeBridge

    // MARK: - Init

    override init() {
        let tokenProvider = TokenProvider(requester: eventEmitter)
        self.tokenProvider = tokenProvider
        self.bridge = VideoHybridNativeBridge(emitter: eventEmitter, rootViewController: nil, accessTokenProviderFactory: {
            tokenProvider
        })
        super.init()
    }

    // MARK: - Bandyer SDK Binding

    @objc(configure:)
    func configure(json: String) {
        perform {
            let config = try KaleyraVideoConfiguration.decodeJSON(json)
            printModuleDebugDescriptionIfNeeded(config)
            try bridge.configureSDK(config)
        }
    }

    @objc(setUserDetailsFormat:)
    func setUserDetailsFormat(json: String) {
        perform {
            bridge.setUserDetailsFormat(try UserDetailsFormat.decodeJSON(json))
        }
    }

    @objc(setAccessTokenResponse:)
    func setAccessTokenResponse(json: String) {
        perform {
            let response = try AccessTokenResponse.decodeJSON(json)
            tokenProvider.onResponse(response)
        }
    }

    @objc(connect:)
    func connect(userID: String) {
        perform {
            try bridge.connect(userID: userID)
        }
    }

    @objc(getCurrentVoIPPushToken:rejecter:)
    func getCurrentVoIPPushToken(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock ) -> Void {
         perform {
            let voIPPushToken = try bridge.getCurrentVoIPPushToken()
            resolve(voIPPushToken)
         }
    }

    @objc(disconnect)
    func disconnect() {
        perform {
            try bridge.disconnect()
        }
    }

    @objc(reset)
    func reset() {
        bridge.reset()
    }

    @objc(startCall:)
    func startCall(json: String) {
        perform {
            try bridge.startCall(try CreateCallOptions.decodeJSON(json))
        }
    }

    @objc(startCallUrl:)
    func startCallUrl(url: String) {
        perform {
            try bridge.startCallUrl(try URL.fromString(url))
        }
    }

    @objc(verifyCurrentCall:)
    func verifyCurrentCall(verify: Bool) {
        perform {
            try bridge.verifyCurrentCall(verify)
        }
    }

    @objc(setDisplayModeForCurrentCall:)
    func setDisplayModeForCurrentCall(mode: String) {
        bridge.setDisplayModeForCurrentCall(mode)
    }

    @objc(addUsersDetails:)
    func addUsersDetails(json: String) {
        perform {
            bridge.addUsersDetails(try Array<UserDetails>.decodeJSON(json))
        }
    }

    @objc(removeUsersDetails)
    func removeUsersDetails() {
        bridge.removeUsersDetails()
    }

    @objc(handlePushNotificationPayload:)
    func handlePushNotificationPayload(json: String) {
        bridge.handlePushNotificationPayload(json)
    }

    @objc(startChat:)
    func startChat(userID: String) {
        perform {
            try bridge.startChat(userID)
        }
    }

    @objc(clearUserCache)
    func clearUserCache() {
        bridge.clearUserCache()
    }

    // MARK: - Helpers

    private func perform(_ work: () throws -> Void) {
        do {
            try work()
        } catch {
            debugPrint(error)
        }
    }

    private func printModuleDebugDescriptionIfNeeded(_ config: KaleyraVideoConfiguration) {
        guard config.logEnabled ?? false else { return }

        _KaleyraVideoHybridVersionInfo().printDebugDescription()
    }
}
