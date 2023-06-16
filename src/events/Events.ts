// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

/**
 * This enum defines all the events that may be handled
 * <br/>
 * <br/>
 * You can listen to these events via [[KaleyraVideo.on]]
 */
export interface Events {
  /**
   * @see [[SetupErrorEvent]]
   */
  onSetupError: ((reason: string) => void) | null;

  /**
   * @see [[CallStatusChangedEvent]]
   */
  onCallModuleStatusChanged: ((status: string) => void) | null;

  /**
   * Register to this event via [[KaleyraVideo.on]]
   * @param callback with the reason as parameter
   */
  onCallError: ((reason: string) => void) | null;

  /**
   * @see [[ChatErrorEvent]]
   */
  onChatError: ((reason: string) => void) | null;

  /**
   * @see [[ChatStatusChangedEvent]]
   */
  onChatModuleStatusChanged: ((status: string) => void) | null;

  /**
   * @see [[VoipPushTokenEvents]]
   */
  oniOSVoipPushTokenUpdated: ((token: string) => void) | null;

  /**
   * @see [[VoipPushTokenEvents]]
   */
  oniOSVoipPushTokenInvalidated: (() => void) | null;
}
