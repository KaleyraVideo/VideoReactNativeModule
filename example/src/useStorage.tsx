// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserStorage {
  private static storageKey = 'user';
  static user = AsyncStorage.getItem(UserStorage.storageKey);
  static useUserStorage = () => {
    const [user, setStoredUser] = React.useState<string | null>();

    const storeUser = async (value: any) => {
      try {
        if (!value) {
          await AsyncStorage.removeItem(UserStorage.storageKey);
          setStoredUser(value);
          return;
        }
        await AsyncStorage.setItem(UserStorage.storageKey, value);
        setStoredUser(value);
      } catch (e) {
        console.error(e);
      }
    };
    const removeUser = async () => {
      await AsyncStorage.removeItem(UserStorage.storageKey);
      setStoredUser(null);
    };

    useEffect(() => {
      const getUser = async () => {
        try {
          const savedValue = await AsyncStorage.getItem(UserStorage.storageKey);
          if (!savedValue) return;
          setStoredUser(savedValue);
        } catch (e) {
          console.error(e);
        }
      };
      getUser();
    }, []);

    return { user, storeUser, removeUser };
  };
}
