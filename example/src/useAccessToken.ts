// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import { API_KEY } from '@env';

export const getAccessToken = async (userID: string) => {
  try {
    const response = await fetch(
      'https://api.sandbox.eu.bandyer.com/rest/sdk/credentials',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': API_KEY,
        },
        body: JSON.stringify({
          user_id: userID,
        }),
      }
    );

    const json = await response.json();
    return json.access_token;
  } catch (error) {
    console.error(error);
  }
};
