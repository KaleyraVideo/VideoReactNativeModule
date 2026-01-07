// eslint-disable-next-line no-undef
module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    },
    default: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },
};
