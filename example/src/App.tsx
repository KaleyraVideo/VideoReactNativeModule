// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { APP_ID, ENVIRONMENT, REGION } from '@env';
import { getAccessToken } from './useAccessToken';
import { Image, Platform, View } from 'react-native';
import { styles } from './styles/styles';
import { Button, TextInput } from 'react-native-paper';
import { Environments, KaleyraVideo, Regions, RecordingType, AudioCallType, CallType } from '@kaleyra/video-react-native-module';
import { NotificationProxy } from './NotificationProxy';
import { HmsPushMessaging } from '@hmscore/react-native-hms-push';
import { UserStorage } from './useStorage';
import messaging from '@react-native-firebase/messaging';

const kaleyraVideo = KaleyraVideo.configure({
  appID: APP_ID,
  environment: Environments.new(ENVIRONMENT),
  region: Regions.new(REGION),
  logEnabled: true,
  tools: {
    chat: {
      audioCallOption: { type: AudioCallType.AUDIO },
      videoCallOption: {
        recordingType: RecordingType.NONE,
      },
    },
    feedback: true,
    fileShare: true,
    screenShare: {
      inApp: true,
      wholeDevice: true,
    },
    whiteboard: true,
  },
  iosConfig: {
    callkit: {
      enabled: false,
    },
  },
});

if (Platform.OS === 'android') {
  HmsPushMessaging.setBackgroundMessageHandler(async (dataMessage: any) => {
    const user = await UserStorage.user;
    const payload = JSON.parse(dataMessage.data);
    kaleyraVideo.handlePushNotificationPayload(
      JSON.stringify(payload.kaleyra.payload),
    );
    if (!user) return Promise.reject('user not logged');
    connect(user);
    console.log('HMS Message handled in the background!', dataMessage);
    return Promise.resolve();
  });
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const user = await UserStorage.user;
    const payload = JSON.parse(remoteMessage.data!.message);
    kaleyraVideo.handlePushNotificationPayload(
      JSON.stringify(payload.kaleyra.payload),
    );
    if (!user) return Promise.reject('user not logged');
    connect(user);
    console.log('FCM Message handled in the background!', remoteMessage);
  });
}
const connect = (user: string) => {
  kaleyraVideo.connect({
    userID: user,
    accessTokenProvider(userId: string): Promise<string> {
      return getAccessToken(userId);
    },
  });
  kaleyraVideo.addUsersDetails([
    {
      userID: 'kri2',
      nickName: 'Kristiyan2',
    },
    {
      userID: 'kri1',
      nickName: 'Kristiyan1',
    },
    {
      userID: 'kri3',
      nickName: 'Kristiyan3',
    },
  ]);

};
const disconnect = () => kaleyraVideo.disconnect();
const call = (participants: string[]) => {
  kaleyraVideo.startCall({
    callees: participants,
    callType: CallType.AUDIO_UPGRADABLE,
  });
};
const chat = (participants: string[]) => {
  kaleyraVideo.startChat(participants[0]);
};

export default function App() {
  const { user, storeUser, removeUser } = UserStorage.useUserStorage();
  const [signInUserInput, setSignInUserInput] = React.useState('');
  const signedUserInitialized = useRef(false);
  const participants = useRef<string[]>([]);

  const signIn = useCallback(
    (signInUser: string) => {
      if (!signInUser) return;
      storeUser(signInUser);
      connect(signInUser);
      kaleyraVideo.events.oniOSVoipPushTokenUpdated = (token: string) => {
        NotificationProxy.subscribeForVoipNotifications(signInUser, token);
      };
      kaleyraVideo.getCurrentVoIPPushToken().then((voipToken) => {
        if (!voipToken) return;
        NotificationProxy.subscribeForVoipNotifications('kri1', voipToken);
      });
      NotificationProxy.subscribeForNotifications(signInUser);
    },
    [storeUser],
  );

  const signOut = () => {
    if (user) NotificationProxy.unsubscribeForNotifications(user);
    removeUser();
    disconnect();
  };

  useEffect(() => {
    if (!user || signedUserInitialized.current) return;
    signedUserInitialized.current = true;
    setSignInUserInput(user);
    signIn(user);
  }, [signIn, user]);

  return (
    <View style={styles.flex}>
      <Image style={styles.logo} source={require('./images/logo.png')} />
      <TextInput
        label='Sign in userID'
        value={signInUserInput}
        onChangeText={(value) => {
          setSignInUserInput(value);
        }}
        autoCapitalize='none'
        disabled={!!user}
      />
      <View style={styles.row}>
        <Button
          mode='contained'
          style={styles.button}
          onPress={() => {
            signIn(signInUserInput);
          }}
          disabled={!!user}
        >
          Sign in
        </Button>
        <Button
          mode='contained'
          style={styles.button}
          onPress={signOut}
          disabled={!user}
        >
          Sign out
        </Button>
      </View>
      <TextInput
        label='Enter users to call/chat'
        disabled={!user}
        autoCapitalize='none'
        onChangeText={(value) => {
          participants.current = value.split(',');
        }}
      />
      <View style={styles.row}>
        <Button
          mode='contained'
          style={styles.button}
          disabled={!user}
          onPress={() => {
            call(participants.current);
          }}
        >
          Call
        </Button>
        <Button
          mode='contained'
          style={styles.button}
          disabled={!user}
          onPress={() => {
            chat(participants.current);
          }}
        >
          Chat
        </Button>
      </View>
    </View>
  );
}
