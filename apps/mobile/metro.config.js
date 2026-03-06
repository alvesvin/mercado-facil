const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "node:module": path.resolve(__dirname, "shims/node-module.js"),
};

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
