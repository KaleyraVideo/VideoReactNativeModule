import { HmsPushInstanceId } from '@hmscore/react-native-hms-push';
import {
  subscribeForNotifications,
  unSubscribeForNotifications,
} from './useNotifications';

import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const getHMSCore = async () => {
  return await import('@hmscore/react-native-hms-availability');
};

export class NotificationProxy {
  private static token: string;
  private static voipToken: string;

  static async subscribeForNotifications(userID: string) {
    if (Platform.OS !== 'android') {
      return;
    }
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const HMSCore = await getHMSCore();
    let pushProvider;

    const isHuaweiSupported =
      (await (HMSCore.default as any).isHuaweiMobileServicesAvailable()) ===
      HMSCore.ErrorCode.HMS_CORE_APK_AVAILABLE;
    if (isHuaweiSupported) {
      pushProvider = 'HMS';
      NotificationProxy.token = (
        await (HmsPushInstanceId.getToken('') as any)
      ).result;
    } else {
      pushProvider = 'FCM';
      await messaging().registerDeviceForRemoteMessages();
      NotificationProxy.token = await messaging().getToken();
    }
    subscribeForNotifications(
      userID,
      NotificationProxy.token,
      'push',
      pushProvider,
    );
  }

  static async subscribeForVoipNotifications(
    userID: string,
    voipToken: string,
  ) {
    NotificationProxy.voipToken = voipToken;
    subscribeForNotifications(userID, NotificationProxy.voipToken, 'voip');
  }

  static unsubscribeForNotifications(userID: string) {
    if (NotificationProxy.voipToken) {
      unSubscribeForNotifications(userID, NotificationProxy.voipToken);
    }
    if (NotificationProxy.token) {
      unSubscribeForNotifications(userID, NotificationProxy.token);
    }
  }

  static unsubscribeForVoipNotifications(userID: string, voipToken: string) {
    unSubscribeForNotifications(userID, voipToken);
  }
}
