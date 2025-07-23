import { StyleSheet } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ZoomableImageViewer } from './ZoomableImageViewer';

const ZoomImageAnimation = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ZoomableImageViewer
        uri="https://picsum.photos/id/237/800/600"
        // onDismiss={() => navigation.goBack()}
      />
    </GestureHandlerRootView>
  );
};

export default ZoomImageAnimation;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
