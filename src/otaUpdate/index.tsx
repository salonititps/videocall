import React, { useEffect } from 'react';
import { View, Text, Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';

const OtaUpdate = () => {
  const checkForUpdate = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'android' ? 'playStore' : 'appStore',
        packageName: 'com.videocalling',
      });

      const currentVersion = VersionCheck.getCurrentVersion();

      if (latestVersion && latestVersion > currentVersion) {
        Alert.alert(
          'Update Required',
          'A new version is available. Please update to continue.',
          [
            {
              text: 'Update Now',
              onPress: () =>
                Linking.openURL(
                  Platform.OS === 'android'
                    ? VersionCheck.getPlayStoreUrl({
                        packageName: 'com.videocalling',
                      })
                    : VersionCheck.getAppStoreUrl({
                        appID: 'YOUR_APPSTORE_ID',
                      }),
                ),
            },
          ],
          { cancelable: false },
        );
      }
    } catch (e) {
      console.warn('Version check failed:', e);
    }
  };

  const checkVersion = async () => {
    try {
      const currentVersion = VersionCheck.getCurrentVersion();

      const response = await fetch('http://10.0.2.2:3000/version');
      const { latestVersion, forceUpdate, updateUrl } = await response.json();

      const isNeeded = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });

      if (isNeeded?.isNeeded && forceUpdate) {
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue.',
          [
            {
              text: 'Update Now',
              onPress: () => {
                Linking.openURL(updateUrl || VersionCheck.getStoreUrl());
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert('Updated App!!');
      }
    } catch (err) {
      console.log('Version check error:', err);
    }
  };

  useEffect(() => {
    checkVersion();
  }, []);

  return (
    <View>
      <Text>OtaUpdate</Text>
    </View>
  );
};

export default OtaUpdate;
