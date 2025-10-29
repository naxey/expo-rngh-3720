// Expo SDK 53 Metro Config Workaround
// https://github.com/expo/expo/issues/36588#issuecomment-2872978642
//   The package at "node_modules/ws/lib/websocket.js" attempted to import the Node standard library module "https".
//   It failed because the native React runtime does not include the Node standard library.

const { getSentryExpoConfig } = require('@sentry/react-native/metro');
// Get the base config with Sentry
const config = getSentryExpoConfig(__dirname);

// Symbolication guard for Hermes internal frames that reference non-existent files
config.symbolicator = {
  customizeFrame: (frame) => {
    const file = frame?.file || '';
    if (
      file.includes('InternalBytecode.js') ||
      file.startsWith('address at (') ||
      file === '<anonymous>'
    ) {
      return { collapse: true };
    }
    return {};
  },
  customizeStack: (stack) => {
    const filtered = stack.filter((frame) => {
      const file = frame?.file || '';
      return (
        !file.includes('InternalBytecode.js') &&
        !file.startsWith('address at (') &&
        file !== '<anonymous>'
      );
    });
    return filtered.length > 0 ? filtered : stack;
  },
};

// Ensure resolver exists
config.resolver = config.resolver || {};

// Include PNPM dlx cache in watchFolders to avoid SHA-1 errors for @expo/cli files
config.watchFolders = Array.from(
  new Set([
    ...(config.watchFolders || []),
    require('path').join(
      require('os').homedir(),
      'Library',
      'Caches',
      'pnpm',
      'dlx'
    ),
  ])
);

// Note: we intentionally do NOT set resolver.unstable_enableSymlinks to keep expo-doctor green

// Temporarily alias expo-file-system to legacy API for SDK 54 migration
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-file-system') {
    const origin = context.originModulePath || '';
    const fromNodeModules = origin.includes('node_modules');
    if (fromNodeModules) {
      return context.resolveRequest(
        context,
        'expo-file-system/legacy',
        platform
      );
    }
  }
  return (originalResolveRequest || context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
