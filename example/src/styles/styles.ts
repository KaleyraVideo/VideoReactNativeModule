// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    // flex: 1,
    borderRadius: 3,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-between',
    gap: 10,
    marginVertical: 32,
    width: '100%',
  },
  logo: {
    marginBottom: 52,
    resizeMode: 'contain',
  },
  flex: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: 32,
  },
});
