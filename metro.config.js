const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this line to fix the package exports issue
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 