import { APP_ID } from '@env';
import { Platform } from 'react-native';

export const subscribeForNotifications = async (
  userID: string,
  push_token: string,
  push_type: string,
  push_provider?: string
) => {
  try {
    await fetch(
      'https://sandbox.bandyer.com/mobile_push_notifications/rest/device',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_alias: userID,
          app_id: APP_ID,
          push_token: push_token,
          platform: Platform.OS.toLowerCase(),
          platform_type: 'react',
          push_provider: push_provider,
          push_type: push_type,
        }),
      }
    );
    console.debug('subscribed for notifications');
    return true;
  } catch (error) {
    console.error(error);
  }
};

export const unSubscribeForNotifications = (
  userID: string,
  push_token: string
) => {
  try {
    fetch(
      `https://sandbox.bandyer.com/mobile_push_notifications/rest/device/${userID}/${APP_ID}/${push_token}`,
      {
        method: 'DELETE',
      }
    ).then((response) =>
      console.debug(`un-subscribed from notifications ${response}`)
    );
    return true;
  } catch (error) {
    console.error(error);
  }
};
