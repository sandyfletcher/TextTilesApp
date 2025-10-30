const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  publicPath: '/TextTilesApp/_expo/static',
};

module.exports = config;