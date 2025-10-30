const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable asset hashing to preserve original paths
config.transformer = {
  ...config.transformer,
  assetPlugins: [],
};

// Keep original asset paths
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'ttf', 'otf'],
};

module.exports = config;