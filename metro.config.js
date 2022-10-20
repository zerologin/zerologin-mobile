const extraNodeModules = require('node-libs-react-native')
const { getDefaultConfig } = require('expo/metro-config')
const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

config.resolver.extraNodeModules = extraNodeModules

const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts

const sourceExts = process.env.RN_SRC_EXT
    ? [...process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts), 'cjs']
    : [...defaultSourceExts, 'cjs']
config.resolver.sourceExts = sourceExts

module.exports = config
