const path = require('path');
const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            [pak.name]: path.join(__dirname, '..', pak.source),
          },
        },
      ],
      ['react-native-paper/babel'],
      ['@babel/plugin-transform-private-methods'],
      ['@babel/plugin-proposal-class-properties'],
    ],
  };
};

