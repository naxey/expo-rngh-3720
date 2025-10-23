import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Swipe Bug Repro',
  slug: 'swipe-bug-repro',
  version: '1.0.0',
  icon: './assets/icon.png',
  ios: {
    bundleIdentifier: 'com.example.swipebug',
  },
  android: {
    package: 'com.example.swipebug',
  },
  plugins: ['expo-router'],
});
