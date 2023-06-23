// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import { NativeModules, Platform } from 'react-native';
import type { KaleyraVideoConfiguration } from '../native-bridge/TypeScript/types/KaleyraVideoConfiguration';
import type { CreateCallOptions } from '../native-bridge/TypeScript/types/CreateCallOptions';
import type { UserDetails } from '../native-bridge/TypeScript/types/UserDetails';
import type { UserDetailsFormat } from '../native-bridge/TypeScript/types/UserDetailsFormat';
import { UserDetailsFormatValidator } from '../native-bridge/TypeScript/UserDetailsFormatValidator';
import { CallType } from '../native-bridge/TypeScript/types/CallType';
import { IllegalArgumentError } from '../native-bridge/TypeScript/errors/IllegalArgumentError';
import { Environments } from '../native-bridge/TypeScript/Environments';
import { CallDisplayMode } from '../native-bridge/TypeScript/types/CallDisplayMode';
import { Regions } from '../native-bridge/TypeScript/Regions';
import type { Session } from '../native-bridge/TypeScript/types/Session';
import { RecordingType } from '../native-bridge/TypeScript/types/RecordingType';
import { AudioCallType } from '../native-bridge/TypeScript/types/AudioCallType';
import { VoipHandlingStrategy } from '../native-bridge/TypeScript/types/VoipHandlingStrategy';
import { AccessTokenResponse } from '../native-bridge/TypeScript/types/AccessTokenResponse';
import { Events as HybridEvents } from '../native-bridge/TypeScript/Events';
import { ReactNativeEventEmitter } from './ReactNativeEventEmitter';
import type { Events } from './events/Events';
import { Tools } from '../native-bridge/TypeScript/types/Tools';
import { IosConfiguration } from '../native-bridge/TypeScript/types/IosConfiguration';
import { CallKitConfiguration } from '../native-bridge/TypeScript/types/CallKitConfiguration';
import { ScreenShareToolConfiguration } from '../native-bridge/TypeScript/types/ScreenShareToolConfiguration';
import { ChatToolConfiguration } from '../native-bridge/TypeScript/types/ChatToolConfiguration';
import { AudioCallOptions } from '../native-bridge/TypeScript/types/AudioCallOptions';
import { CallOptions } from '../native-bridge/TypeScript/types/CallOptions';

const LINKING_ERROR =
  `The package 'video-react-native-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VideoNativeModuleBridge = NativeModules.VideoNativeModule
  ? NativeModules.VideoNativeModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const VideoNativeEmitter = NativeModules.VideoNativeEmitter
  ? NativeModules.VideoNativeEmitter
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * KaleyraVideo
 */
class KaleyraVideo {
  /**
   * <b>To create an instance of the Kaleyra Video invoke the [[configure]] method</b>
   */
  static instance: KaleyraVideo;

  private readonly eventEmitter: ReactNativeEventEmitter;

  events: Events;

  constructor(eventEmitter: ReactNativeEventEmitter) {
    this.eventEmitter = eventEmitter;
    this.events = eventEmitter;
  }

  /**
   * Call this method when device is ready to configure the module
   * @param configuration
   * @throws IllegalArgumentError
   */
  static configure(configuration: KaleyraVideoConfiguration): KaleyraVideo {
    if (configuration.appID === '') {
      throw new IllegalArgumentError('Expected a not empty appId!');
    }

    if (this.instance) {
      console.warn('KaleyraVideo was already setup.');
      return this.instance;
    }

    VideoNativeModuleBridge.configure(JSON.stringify(configuration));
    this.instance = new KaleyraVideo(
      new ReactNativeEventEmitter(VideoNativeEmitter)
    );

    return this.instance;
  }

  /**
   * @ignore
   * @private
   */
  private static _isAndroid() {
    return Platform.OS === 'android';
  }

  /**
   * @ignore
   * @private
   */
  private static _isIOS() {
    return Platform.OS === 'ios';
  }

  /**
   * Connect the plugin
   * @param session session to connect with
   * @throws IllegalArgumentError
   */
  connect(session: Session) {
    if (session.userID === '') {
      throw new IllegalArgumentError('Expected a not empty userId!');
    }
    this.eventEmitter.on(HybridEvents.accessTokenRequest, (data) => {
      const accessTokenRequest = JSON.parse(data);
      session.accessTokenProvider(accessTokenRequest.userID).then(
        (token) => {
          const response = AccessTokenResponse.success(
            accessTokenRequest.requestID,
            token
          );
          VideoNativeModuleBridge.setAccessTokenResponse(
            JSON.stringify(response)
          );
        },
        (err: string) => {
          const response = AccessTokenResponse.failed(
            accessTokenRequest.requestID,
            err
          );
          VideoNativeModuleBridge.setAccessTokenResponse(
            JSON.stringify(response)
          );
        }
      );
    });
    VideoNativeModuleBridge.connect(session.userID);
  }

  /**
   * Stop the plugin
   */
  disconnect() {
    VideoNativeModuleBridge.disconnect();
    this.eventEmitter.clear();
  }

  /**
   * This method allows you to reset the configuration.
   */
  reset() {
    if (KaleyraVideo._isAndroid()) {
      VideoNativeModuleBridge.reset();
    } else {
      console.warn('Not yet supported on ', Platform.OS, ' platform.');
    }
  }

  /**
   * Get the current state of the plugin
   * @return the state as a promise
   */
  // state() {
  //   return new Promise((resolve, reject) => {
  //     cordova.exec(resolve, reject, 'BandyerPlugin', 'state', []);
  //   });
  // }

  /**
   * Start Call with the callee defined
   * @param callOptions
   * @throws IllegalArgumentError
   */
  startCall(callOptions: CreateCallOptions) {
    if (callOptions.callees.length === 0) {
      throw new IllegalArgumentError('No userIds were provided!');
    }
    if (
      callOptions.callees.filter((str) => str.trim().length <= 0).length > 0
    ) {
      throw new IllegalArgumentError('Some empty userIds were provided');
    }

    VideoNativeModuleBridge.startCall(JSON.stringify(callOptions));
  }

  /**
   * Verify the user for the current call
   * @param verify true if the user is verified, false otherwise
   * @throws IllegalArgumentError
   */
  verifyCurrentCall(verify: boolean) {
    if (KaleyraVideo._isAndroid()) {
      VideoNativeModuleBridge.verifyCurrentCall(verify);
    } else {
      console.warn('Not yet supported on ', Platform.OS, ' platform.');
    }
  }

  /**
   * Set the UI display mode for the current call
   * @param mode FOREGROUND, FOREGROUND_PICTURE_IN_PICTURE, BACKGROUND
   * @throws IllegalArgumentError
   */
  setDisplayModeForCurrentCall(mode: CallDisplayMode) {
    if (KaleyraVideo._isAndroid()) {
      VideoNativeModuleBridge.setDisplayModeForCurrentCall(
        JSON.stringify(mode)
      );
    } else {
      console.warn('Not supported by ', Platform.OS, ' platform.');
    }
  }

  /**
   * Start Call from url
   * @param url received
   * @throws IllegalArgumentError
   */
  startCallFrom(url: string) {
    if (url === '' || url === 'undefined') {
      throw new IllegalArgumentError('Invalid url!');
    }
    VideoNativeModuleBridge.startCallUrl(url);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Call this method to provide the details for each user to be used to set up the UI
   * @param userDetails  array of user details
   * @throws IllegalArgumentError
   */
  addUsersDetails(userDetails: UserDetails[]) {
    if (userDetails.length === 0) {
      throw new IllegalArgumentError('No userDetails were provided!');
    }

    VideoNativeModuleBridge.addUsersDetails(JSON.stringify(userDetails));
  }

  setUserDetailsFormat(format: UserDetailsFormat) {
    const validator = new UserDetailsFormatValidator();
    validator.validate(format.default);
    if (format.androidNotification !== undefined) {
      validator.validate(format.androidNotification);
    }

    VideoNativeModuleBridge.setUserDetailsFormat(JSON.stringify(format));
  }

  /**
   * Call this method to remove all the user details previously provided.
   */
  removeUsersDetails() {
    VideoNativeModuleBridge.removeUsersDetails();
  }

  /**
   * Call this method to handle a notification!
   *
   * @param payload notification data payload as String
   * @throws IllegalArgumentError
   */
  handlePushNotificationPayload(payload: string) {
    if (payload === '' || payload === 'undefined') {
      throw new IllegalArgumentError('Expected a not empty payload!');
    }

    VideoNativeModuleBridge.handlePushNotificationPayload(
      JSON.stringify(payload)
    );
  }

  /**
   * Open chat
   * @param userID user you want to chat with
   * @throws IllegalArgumentError
   */
  startChat(userID: string) {
    if (userID === '') {
      throw new IllegalArgumentError('Expected a not empty userId!');
    }

    VideoNativeModuleBridge.startChat(userID);
  }

  /**
   * This method allows you to clear all user cached data, such as chat messages and generic information.
   */
  clearUserCache() {
    if (KaleyraVideo._isAndroid()) {
      VideoNativeModuleBridge.clearUserCache();
    } else {
      console.warn('Not yet supported on ', Platform.OS, ' platform.');
    }
  }

  /**
   * This method returns the current voip push token
   * @return promise of voipPushToken or undefined if has not been generated yet.
   */
  getCurrentVoIPPushToken(): Promise<string> {
    if (!KaleyraVideo._isIOS()) {
      return Promise.reject('Token has not been generated yet.');
    }
    return VideoNativeModuleBridge.getCurrentVoIPPushToken();
  }
}

export {
  KaleyraVideo,
  KaleyraVideoConfiguration,
  CreateCallOptions,
  Tools,
  ScreenShareToolConfiguration,
  ChatToolConfiguration,
  AudioCallOptions,
  AudioCallType,
  CallOptions,
  RecordingType,
  IosConfiguration,
  CallKitConfiguration,
  VoipHandlingStrategy,
  CallType,
  Regions,
  UserDetails,
  UserDetailsFormat,
  CallDisplayMode,
  Session,
  Environments,
  Events,
};
