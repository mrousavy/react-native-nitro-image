import {
  androidPlatform,
  androidEmulator,
} from '@react-native-harness/platform-android';
import {
  applePlatform,
  appleSimulator,
} from '@react-native-harness/platform-apple';

const config = {
  entryPoint: './index.js',
  appRegistryComponentName: 'NitroImageExample',

  runners: [
    androidPlatform({
      name: 'android',
      device: androidEmulator('Pixel_8_API_35'),
      bundleId: 'com.nitroimageexample',
    }),
    applePlatform({
      name: 'ios',
      device: appleSimulator('iPhone 17 Pro', '26.2'),
      bundleId: 'com.mrousavy.nitro.image',
    }),
  ],
  defaultRunner: 'android',
  bridgeTimeout: 180000,
};

export default config;
