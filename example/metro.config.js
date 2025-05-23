// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

module.exports = function (baseConfig) {
   const defaultConfig = mergeConfig(baseConfig, getDefaultConfig(__dirname));
   const {resolver: {assetExts, sourceExts}} = defaultConfig;

    return mergeConfig(
      defaultConfig,
      {
        projectRoot: __dirname,
        watchFolders: [root],
        // We need to make sure that only one version is loaded for peerDependencies
         // So we block them at the root, and alias them to the versions in example's node_modules
         resolver: {
           blacklistRE: exclusionList(
             modules.map(
               (m) =>
                 new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
             )
           ),

           extraNodeModules: modules.reduce((acc, name) => {
             acc[name] = path.join(__dirname, 'node_modules', name);
             return acc;
           }, {}),

           assetExts: assetExts.filter(ext => ext !== 'svg'),
           sourceExts: [...sourceExts, 'svg'],
         },

         transformer: {
           getTransformOptions: async () => ({
             transform: {
               experimentalImportSupport: false,
               inlineRequires: true,
             },
           }),
         },
      },
    );
};
