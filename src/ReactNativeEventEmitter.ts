/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import { NativeEventEmitter, NativeModule } from 'react-native';
import type { Events } from './events/Events';
import { Events as HybridEvents } from '../native-bridge/TypeScript/Events';

export class ReactNativeEventEmitter
  extends NativeEventEmitter
  implements Events
{
  constructor(nativeModule: NativeModule) {
    super(nativeModule);

    this.on(HybridEvents.setupError, (args) => this.onSetupError(args));
    this.on(HybridEvents.callError, (args) => this.onCallError(args));
    this.on(HybridEvents.chatError, (args) => this.onChatError(args));
    this.on(HybridEvents.iOSVoipPushTokenInvalidated, () =>
      this.oniOSVoipPushTokenInvalidated()
    );
    this.on(HybridEvents.iOSVoipPushTokenUpdated, (args) =>
      this.oniOSVoipPushTokenUpdated(args)
    );
    this.on(HybridEvents.callModuleStatusChanged, (args) => {
      this.onCallModuleStatusChanged(args);
    });
    this.on(HybridEvents.chatModuleStatusChanged, (args) =>
      this.onChatModuleStatusChanged(args)
    );
  }

  onSetupError = (_: string) => {};
  onCallModuleStatusChanged = (_: string) => {};
  onCallError = (_: string) => {};
  oniOSVoipPushTokenUpdated = (_: string) => {};
  onChatError = (_: string) => {};
  onChatModuleStatusChanged = (_: string) => {};
  oniOSVoipPushTokenInvalidated = () => {};

  on(event: HybridEvents, listener: (...args: any[]) => any) {
    if (this.listenerCount(event) > 0) this.removeAllListeners(event);
    this.addListener(event, listener);
  }

  clear() {
    for (const event in HybridEvents) {
      this.removeAllListeners(event);
    }
  }
}
